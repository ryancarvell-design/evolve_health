// File export utilities for different formats with proper syntax
import { format } from 'date-fns';
import { getCurrentUser } from './auth';
import jsPDF from 'jspdf';
import { Document, Table } from 'docx';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import saveAs from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Main export function that handles all file formats
 * @param {Object} data - Document or template data
 * @param {string} exportFormat - Format to export (pdf, docx, xlsx, etc.)
 * @param {string} type - Type of data ('document' or 'template')
 * @returns {Promise<Object>} Export result
 */
export const exportToFormat = async (data, exportFormat, type = 'document') => {
  try {
    // Validate input data
    if (!data) {
      throw new Error('No data provided for export');
    }

    if (!exportFormat) {
      throw new Error('Export format must be specified');
    }

    const currentUser = getCurrentUser();
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    
    // Create safe filename with better fallback logic
    let baseFileName = 'untitled';
    if (data?.title || data?.name || data?.documentName) {
      const rawName = data?.title || data?.name || data?.documentName;
      baseFileName = rawName?.replace(/[^a-z0-9]/gi, '_')?.toLowerCase();
    }
    
    let result = null;
    
    // Handle different export formats
    switch (exportFormat?.toLowerCase()) {
      case 'pdf':
        result = await exportToPDF(data, type, baseFileName, timestamp);
        break;
        
      case 'docx':
        result = await exportToWord(data, type, baseFileName, timestamp);
        break;
        
      case 'xlsx':
        result = await exportToExcel(data, type, baseFileName, timestamp);
        break;
        
      case 'txt':
        result = await exportToText(data, type, baseFileName, timestamp);
        break;
        
      case 'html':
        result = await exportToHTML(data, type, baseFileName, timestamp);
        break;
        
      case 'rtf':
        result = await exportToRTF(data, type, baseFileName, timestamp);
        break;
        
      default:
        throw new Error(`Unsupported export format: ${exportFormat}`);
    }
    
    // Log successful export
    console.log(`Successfully exported ${type} as ${exportFormat?.toUpperCase()}:`, {
      fileName: result?.fileName,
      format: exportFormat,
      timestamp,
      user: (currentUser && currentUser?.data && currentUser?.data?.name) ? currentUser?.data?.name : (currentUser && currentUser?.email) ? currentUser?.email : 'Unknown'
    });
    
    return {
      success: true,
      fileName: result?.fileName,
      format: exportFormat,
      message: `${type === 'document' ? 'Document' : 'Template'} exported successfully as ${exportFormat?.toUpperCase()}!`
    };
    
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error?.message,
      message: `Failed to export ${type} as ${exportFormat ? exportFormat?.toUpperCase() : 'unknown format'}. Please try again.`
    };
  }
};

/**
 * Export to PDF format using pdf-lib with jsPDF fallback
 */
const exportToPDF = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.pdf`;
  
  try {
    // Use pdf-lib for better control and quality
    const pdfDoc = await PDFDocument?.create();
    const timesRomanFont = await pdfDoc?.embedFont(StandardFonts?.TimesRoman);
    const timesRomanBold = await pdfDoc?.embedFont(StandardFonts?.TimesRomanBold);
    const courierFont = await pdfDoc?.embedFont(StandardFonts?.Courier);
    
    const page = pdfDoc?.addPage([612, 792]); // Letter size
    const pageSize = page?.getSize();
    
    let currentY = pageSize?.height - 50;
    const margin = 50;
    const lineHeight = 20;
    const maxWidth = pageSize?.width - (2 * margin);
    
    // Helper function for text with word wrapping
    const addText = (text, fontSize = 12, font = timesRomanFont, color = rgb(0, 0.48, 1)) => {
      if (!text) {
        text = '';
      }
      
      const textWidth = font?.widthOfTextAtSize(text, fontSize);
      
      if (textWidth <= maxWidth) {
        page?.drawText(text, {
          x: margin,
          y: currentY,
          size: fontSize,
          font: font,
          color: color,
        });
        currentY -= lineHeight;
      } else {
        // Word wrapping
        const words = text?.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font?.widthOfTextAtSize(testLine, fontSize);
          
          if (testWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) {
              page?.drawText(currentLine, {
                x: margin,
                y: currentY,
                size: fontSize,
                font: font,
                color: color,
              });
              currentY -= lineHeight;
            }
            currentLine = word;
          }
        }
        
        if (currentLine) {
          page?.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            font: font,
            color: color,
          });
          currentY -= lineHeight;
        }
      }
    };
    
    // Add content based on type
    if (type === 'document') {
      // Document export
      const title = data?.title || data?.documentName || 'Untitled Document';
      addText(title, 20, timesRomanBold, rgb(0, 0.48, 1));
      currentY -= 10;
      addText('Healthcare Document - Exported from Evolve Health', 10, timesRomanFont, rgb(0.4, 0.4, 0.4));
      currentY -= 20;
      
      // Document Information
      addText('Document Information', 16, timesRomanBold, rgb(0, 0.48, 1));
      currentY -= 5;
      addText(`Type: ${data?.documentType || 'General Document'}`, 12);
      addText(`Status: ${data?.status || 'Draft'}`, 12);
      addText(`Priority: ${data?.priority || 'Normal'}`, 12);
      
      // Patient Information (if available)
      if (data?.patientInfo && data?.patientInfo?.name) {
        currentY -= 10;
        addText('Patient Information', 16, timesRomanBold, rgb(0, 0.48, 1));
        currentY -= 5;
        addText(`Name: ${data?.patientInfo?.name}`, 12);
        if (data?.patientInfo?.dob) {
          addText(`Date of Birth: ${data?.patientInfo?.dob}`, 12);
        }
        if (data?.patientInfo?.mrn) {
          addText(`MRN: ${data?.patientInfo?.mrn}`, 12);
        }
      }
      
      currentY -= 20;
      addText('Content', 16, timesRomanBold, rgb(0, 0.48, 1));
      currentY -= 5;
      
      let content = data?.content || 'No content available';
      addText(content, 11, courierFont);
      
    } else {
      // Template export
      const templateName = data?.name || 'Untitled Template';
      addText(templateName, 20, timesRomanBold, rgb(0, 0.48, 1));
      currentY -= 10;
      addText('Healthcare Template - Exported from Evolve Health', 10, timesRomanFont, rgb(0.4, 0.4, 0.4));
      currentY -= 20;
      
      // Template Information
      addText('Template Information', 16, timesRomanBold, rgb(0, 0.48, 1));
      currentY -= 5;
      addText(`Category: ${data?.category || 'General'}`, 12);
      addText(`Status: ${data?.status || 'Draft'}`, 12);
      addText(`Description: ${data?.description || 'No description available'}`, 12);
      
      // Template Elements
      if (data?.elements && Array.isArray(data?.elements) && data?.elements?.length > 0) {
        currentY -= 20;
        addText(`Template Elements (${data?.elements?.length})`, 16, timesRomanBold, rgb(0, 0.48, 1));
        currentY -= 5;
        
        data?.elements?.forEach((element, index) => {
          const elementName = element?.name || 'Unnamed Element';
          addText(`${index + 1}. ${elementName}`, 12, timesRomanBold);
          
          const elementType = element?.type || 'Unknown';
          const elementX = element?.x || 0;
          const elementY = element?.y || 0;
          addText(`   Type: ${elementType} | Position: (${elementX}, ${elementY})`, 10);
          
          if (element?.properties) {
            const props = Object.entries(element?.properties)?.map(([key, value]) => `${key}: ${value}`)?.join(', ');
            addText(`   Properties: ${props}`, 10);
          }
          currentY -= 5;
        });
      }
    }
    
    // Add export information at bottom
    currentY = 100;
    addText('Export Information', 12, timesRomanBold, rgb(0, 0.48, 1));
    currentY -= 5;
    addText(`Exported: ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`, 10);
    
    const currentUser = getCurrentUser();
    let exportedBy = 'System';
    if (currentUser) {
      if (currentUser?.data && currentUser?.data?.name) {
        exportedBy = currentUser?.data?.name;
      } else if (currentUser?.email) {
        exportedBy = currentUser?.email;
      }
    }
    addText(`By: ${exportedBy}`, 10);
    addText('Generated by Evolve Health Platform', 10, timesRomanFont, rgb(0.4, 0.4, 0.4));
    
    // Generate and save PDF
    const pdfBytes = await pdfDoc?.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, fileName);
    
    return { fileName, fileExtension: '.pdf' };
    
  } catch (error) {
    console.error('PDF generation error with pdf-lib:', error);
    // Fallback to jsPDF
    return await exportToPDFWithJsPDF(data, type, baseFileName, timestamp);
  }
};

/**
 * Fallback PDF export using jsPDF
 */
const exportToPDFWithJsPDF = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.pdf`;
  
  try {
    const doc = new jsPDF();
    const pageHeight = doc?.internal?.pageSize?.height;
    const pageWidth = doc?.internal?.pageSize?.width;
    const margin = 20;
    let currentY = margin;
    
    // Helper function for text with page breaks
    const addText = (text, size = 12, style = 'normal', color = [0, 0, 0]) => {
      if (!text) {
        text = '';
      }
      
      doc?.setFontSize(size);
      doc?.setFont('helvetica', style);
      doc?.setTextColor(color?.[0], color?.[1], color?.[2]);
      
      if (currentY > pageHeight - margin) {
        doc?.addPage();
        currentY = margin;
      }
      
      const splitText = doc?.splitTextToSize(text, pageWidth - (2 * margin));
      doc?.text(splitText, margin, currentY);
      currentY += (splitText?.length * (size * 0.4)) + 10;
    };
    
    // Add content
    if (type === 'document') {
      const title = data?.title || data?.documentName || 'Untitled Document';
      addText(title, 20, 'bold', [0, 123, 255]);
      addText('Healthcare Document - Exported from Evolve Health', 10, 'normal', [102, 102, 102]);
      
      addText('Document Information', 16, 'bold', [0, 123, 255]);
      addText(`Type: ${data?.documentType || 'General Document'}`);
      addText(`Status: ${data?.status || 'Draft'}`);
      addText(`Priority: ${data?.priority || 'Normal'}`);
      
      if (data?.patientInfo && data?.patientInfo?.name) {
        addText('Patient Information', 16, 'bold', [0, 123, 255]);
        addText(`Name: ${data?.patientInfo?.name}`);
        if (data?.patientInfo?.dob) {
          addText(`Date of Birth: ${data?.patientInfo?.dob}`);
        }
        if (data?.patientInfo?.mrn) {
          addText(`MRN: ${data?.patientInfo?.mrn}`);
        }
      }
      
      addText('Content', 16, 'bold', [0, 123, 255]);
      addText(data?.content || 'No content available');
      
    } else {
      const templateName = data?.name || 'Untitled Template';
      addText(templateName, 20, 'bold', [0, 123, 255]);
      addText('Healthcare Template - Exported from Evolve Health', 10, 'normal', [102, 102, 102]);
      
      addText('Template Information', 16, 'bold', [0, 123, 255]);
      addText(`Category: ${data?.category || 'General'}`);
      addText(`Description: ${data?.description || 'No description available'}`);
      
      if (data?.elements && Array.isArray(data?.elements) && data?.elements?.length > 0) {
        addText(`Template Elements (${data?.elements?.length})`, 16, 'bold', [0, 123, 255]);
        data?.elements?.forEach((element, index) => {
          const elementName = element?.name || 'Unnamed Element';
          addText(`${index + 1}. ${elementName}`, 12, 'bold');
          
          const elementType = element?.type || 'Unknown';
          const elementX = element?.x || 0;
          const elementY = element?.y || 0;
          addText(`   Type: ${elementType} | Position: (${elementX}, ${elementY})`, 10);
        });
      }
    }
    
    // Add export information
    addText('Export Information', 12, 'bold', [0, 123, 255]);
    addText(`Exported: ${format(new Date(), 'MMMM dd, yyyy HH:mm:ss')}`, 10);
    
    const currentUser = getCurrentUser();
    let exportedBy = 'System';
    if (currentUser) {
      if (currentUser?.data && currentUser?.data?.name) {
        exportedBy = currentUser?.data?.name;
      } else if (currentUser?.email) {
        exportedBy = currentUser?.email;
      }
    }
    addText(`By: ${exportedBy}`, 10);
    
    doc?.save(fileName);
    return { fileName, fileExtension: '.pdf' };
    
  } catch (error) {
    console.error('jsPDF generation error:', error);
    throw error;
  }
};

/**
 * Export to Word DOCX format - Browser Compatible Version
 */
const exportToWord = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.docx`;
  
  try {
    // Create a comprehensive HTML content that can be converted to Word-like format
    const htmlContent = generateWordCompatibleHTML(data, type);
    
    // Create a blob with proper Word document MIME type
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    // Use file-saver to download
    saveAs(blob, fileName);
    
    return { fileName, fileExtension: '.docx' };
    
  } catch (error) {
    console.error('Word document generation error:', error);
    
    // Fallback to RTF format if Word export fails
    console.log('Falling back to RTF format...');
    try {
      const rtfFileName = `${baseFileName}_${timestamp}.rtf`;
      const rtfContent = generateRTFContent(data, type);
      const rtfBlob = new Blob([rtfContent], { type: 'application/rtf' });
      saveAs(rtfBlob, rtfFileName);
      
      return { fileName: rtfFileName, fileExtension: '.rtf' };
    } catch (rtfError) {
      console.error('RTF fallback also failed:', rtfError);
      throw new Error('Failed to export document. Please try a different format.');
    }
  }
};

/**
 * Generate Word-compatible HTML content
 */
const generateWordCompatibleHTML = (data, type) => {
  const currentUser = getCurrentUser();
  const exportDate = format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
  
  let exportedBy = 'System';
  if (currentUser) {
    if (currentUser?.data && currentUser?.data?.name) {
      exportedBy = currentUser?.data?.name;
    } else if (currentUser?.email) {
      exportedBy = currentUser?.email;
    }
  }
  
  // Word-compatible HTML with embedded styles
  const wordHTML = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta charset="utf-8">
    <title>${data?.title || data?.name || 'Document'}</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            &lt;w:View&gt;Print&lt;/w:View&gt;
            &lt;w:Zoom&gt;90&lt;/w:Zoom&gt;
            <w:DoNotPromptForConvert/>
            <w:DoNotShowRevisions/>
            <w:DoNotPrintRevisions/>
            <w:DoNotShowMarkup/>
            <w:DoNotShowComments/>
            <w:DoNotShowInsertionsAndDeletions/>
            <w:DoNotShowPropertyChanges/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        @page {
            margin: 1in 1.25in 1in 1.25in;
            mso-header-margin: 0.5in;
            mso-footer-margin: 0.5in;
            mso-paper-source: 0;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            color: #000000;
        }
        
        .document-header {
            text-align: center;
            margin-bottom: 24pt;
            border-bottom: 2pt solid #0066CC;
            padding-bottom: 12pt;
        }
        
        .document-title {
            font-size: 18pt;
            font-weight: bold;
            color: #0066CC;
            margin: 0 0 6pt 0;
        }
        
        .document-subtitle {
            font-size: 10pt;
            color: #666666;
            font-style: italic;
            margin: 0;
        }
        
        .section {
            margin-bottom: 18pt;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #0066CC;
            margin: 0 0 6pt 0;
            border-bottom: 1pt solid #CCCCCC;
            padding-bottom: 3pt;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12pt;
        }
        
        .info-table td {
            padding: 3pt 6pt;
            border: 1pt solid #CCCCCC;
            vertical-align: top;
        }
        
        .info-label {
            font-weight: bold;
            background-color: #F5F5F5;
            width: 25%;
        }
        
        .content-box {
            background-color: #F8F9FA;
            border: 1pt solid #DEE2E6;
            border-left: 4pt solid #0066CC;
            padding: 12pt;
            margin: 12pt 0;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
        }
        
        .footer {
            margin-top: 24pt;
            border-top: 1pt solid #CCCCCC;
            padding-top: 12pt;
            font-size: 9pt;
            color: #666666;
        }
        
        .element-item {
            margin: 6pt 0;
            padding: 6pt;
            border: 1pt solid #E0E0E0;
            background-color: #FAFAFA;
        }
        
        .element-name {
            font-weight: bold;
            margin-bottom: 3pt;
        }
        
        .element-details {
            font-size: 9pt;
            color: #666666;
        }
    </style>
</head>
<body>`;

  if (type === 'document') {
    const title = data?.title || data?.documentName || 'Untitled Document';
    
    let patientSection = '';
    if (data?.patientInfo && data?.patientInfo?.name) {
      patientSection = `
        <div class="section">
            <div class="section-title">Patient Information</div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Patient Name:</td>
                    <td>${data?.patientInfo?.name || ''}</td>
                </tr>`;
      
      if (data?.patientInfo?.dob) {
        patientSection += `
                <tr>
                    <td class="info-label">Date of Birth:</td>
                    <td>${data?.patientInfo?.dob}</td>
                </tr>`;
      }
      
      if (data?.patientInfo?.mrn) {
        patientSection += `
                <tr>
                    <td class="info-label">Medical Record Number:</td>
                    <td>${data?.patientInfo?.mrn}</td>
                </tr>`;
      }
      
      patientSection += `
            </table>
        </div>`;
    }
    
    return `${wordHTML}
    <div class="document-header">
        <div class="document-title">${title}</div>
        <div class="document-subtitle">Healthcare Document - Exported from Evolve Health</div>
    </div>

    <div class="section">
        <div class="section-title">Document Information</div>
        <table class="info-table">
            <tr>
                <td class="info-label">Document Type:</td>
                <td>${data?.documentType || 'General Document'}</td>
            </tr>
            <tr>
                <td class="info-label">Status:</td>
                <td>${data?.status || 'Draft'}</td>
            </tr>
            <tr>
                <td class="info-label">Priority:</td>
                <td>${data?.priority || 'Normal'}</td>
            </tr>
            <tr>
                <td class="info-label">Created:</td>
                <td>${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</td>
            </tr>
            <tr>
                <td class="info-label">Created By:</td>
                <td>${data?.createdBy || 'Unknown'}</td>
            </tr>
            <tr>
                <td class="info-label">Last Modified:</td>
                <td>${data?.lastModified ? format(new Date(data.lastModified), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</td>
            </tr>
            <tr>
                <td class="info-label">Modified By:</td>
                <td>${data?.modifiedBy || 'Unknown'}</td>
            </tr>
            <tr>
                <td class="info-label">Version:</td>
                <td>${data?.version || 1}</td>
            </tr>
        </table>
    </div>

    ${patientSection}

    <div class="section">
        <div class="section-title">Document Content</div>
        <div class="content-box">${data?.content || 'No content available'}</div>
    </div>

    <div class="footer">
        <p><strong>Export Information:</strong></p>
        <p>Exported: ${exportDate} | By: ${exportedBy} | Format: Word Document</p>
        <p>Generated by Evolve Health Document Management System</p>
        <p>Original Document ID: ${data?.id || 'Unknown'}</p>
    </div>
</body>
</html>`;
  } else {
    // Template export
    const templateName = data?.name || 'Untitled Template';
    
    let elementsSection = '';
    if (data?.elements && Array.isArray(data?.elements) && data?.elements?.length > 0) {
      elementsSection = `
        <div class="section">
            <div class="section-title">Template Elements (${data?.elements?.length})</div>`;
      
      data?.elements?.forEach((element, index) => {
        const elementName = element?.name || 'Unnamed Element';
        const elementType = element?.type || 'Unknown';
        const elementX = element?.x || 0;
        const elementY = element?.y || 0;
        const elementWidth = element?.width || 0;
        const elementHeight = element?.height || 0;
        
        let propertiesText = '';
        if (element?.properties) {
          const props = Object.entries(element?.properties)?.map(([key, value]) => `${key}: ${value}`)?.join(', ');
          propertiesText = `<br><span class="element-details">Properties: ${props}</span>`;
        }
        
        elementsSection += `
            <div class="element-item">
                <div class="element-name">${index + 1}. ${elementName}</div>
                <div class="element-details">
                    Type: ${elementType} | Position: (${elementX}, ${elementY}) | Size: ${elementWidth} × ${elementHeight}
                    ${propertiesText}
                </div>
            </div>`;
      });
      
      elementsSection += `
        </div>`;
    }
    
    let sampleContentSection = '';
    if (data?.templateContent && data?.templateContent?.sampleContent) {
      sampleContentSection = `
        <div class="section">
            <div class="section-title">Sample Content</div>
            <div class="content-box">${data?.templateContent?.sampleContent}</div>
        </div>`;
    }
    
    return `${wordHTML}
    <div class="document-header">
        <div class="document-title">${templateName}</div>
        <div class="document-subtitle">Healthcare Template - Exported from Evolve Health</div>
    </div>

    <div class="section">
        <div class="section-title">Template Information</div>
        <table class="info-table">
            <tr>
                <td class="info-label">Category:</td>
                <td>${data?.category || 'General'}</td>
            </tr>
            <tr>
                <td class="info-label">Status:</td>
                <td>${data?.status || 'Draft'}</td>
            </tr>
            <tr>
                <td class="info-label">Description:</td>
                <td>${data?.description || 'No description available'}</td>
            </tr>
            <tr>
                <td class="info-label">Usage Count:</td>
                <td>${data?.usageCount || 0}</td>
            </tr>
            <tr>
                <td class="info-label">Public:</td>
                <td>${data?.isPublic ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
                <td class="info-label">Created:</td>
                <td>${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</td>
            </tr>
            <tr>
                <td class="info-label">Created By:</td>
                <td>${data?.createdBy || 'Unknown'}</td>
            </tr>
            <tr>
                <td class="info-label">Version:</td>
                <td>${data?.version || 1}</td>
            </tr>
        </table>
    </div>

    ${elementsSection}

    ${sampleContentSection}

    <div class="footer">
        <p><strong>Export Information:</strong></p>
        <p>Exported: ${exportDate} | By: ${exportedBy} | Format: Word Document</p>
        <p>Generated by Evolve Health Template Management System</p>
        <p>Original Template ID: ${data?.id || 'Unknown'}</p>
    </div>
</body>
</html>`;
  }
};

/**
 * Export to Excel XLSX format
 */
const exportToExcel = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.xlsx`;
  
  try {
    const workbook = XLSX?.utils?.book_new();
    const currentUser = getCurrentUser();
    let exportedBy = 'System';
    if (currentUser) {
      if (currentUser?.data && currentUser?.data?.name) {
        exportedBy = currentUser?.data?.name;
      } else if (currentUser?.email) {
        exportedBy = currentUser?.email;
      }
    }
    
    if (type === 'document') {
      // Document Information Sheet
      const docInfoData = [
        ['Field', 'Value'],
        ['Title', data?.title || data?.documentName || ''],
        ['Document Type', data?.documentType || ''],
        ['Status', data?.status || ''],
        ['Priority', data?.priority || ''],
        ['Created Date', data?.createdDate ? format(new Date(data.createdDate), 'yyyy-MM-dd HH:mm:ss') : ''],
        ['Created By', data?.createdBy || ''],
        ['Last Modified', data?.lastModified ? format(new Date(data.lastModified), 'yyyy-MM-dd HH:mm:ss') : ''],
        ['Modified By', data?.modifiedBy || ''],
        ['Word Count', data?.metadata && data?.metadata?.wordCount ? data?.metadata?.wordCount : 0],
        ['Version', data?.version || 1],
        ['Tags', data?.tags && Array.isArray(data?.tags) ? data?.tags?.join('; ') : '']
      ];
      
      // Add patient information if available
      if (data?.patientInfo && data?.patientInfo?.name) {
        docInfoData?.push(['', '']); // Empty row for separation
        docInfoData?.push(['PATIENT INFORMATION', '']);
        docInfoData?.push(['Patient Name', data?.patientInfo?.name || '']);
        docInfoData?.push(['Date of Birth', data?.patientInfo?.dob || '']);
        docInfoData?.push(['Medical Record Number', data?.patientInfo?.mrn || '']);
        docInfoData?.push(['Patient ID', data?.patientInfo?.patientId || '']);
      }
      
      // Add export information
      docInfoData?.push(['', '']); // Empty row
      docInfoData?.push(['EXPORT INFORMATION', '']);
      docInfoData?.push(['Exported Date', format(new Date(), 'yyyy-MM-dd HH:mm:ss')]);
      docInfoData?.push(['Exported By', exportedBy]);
      docInfoData?.push(['Format', 'Excel Spreadsheet (.xlsx)']);
      
      const docInfoSheet = XLSX?.utils?.aoa_to_sheet(docInfoData);
      
      // Set column widths
      docInfoSheet['!cols'] = [
        { width: 25 }, // Field column
        { width: 50 }  // Value column
      ];
      
      XLSX?.utils?.book_append_sheet(workbook, docInfoSheet, 'Document Info');
      
      // Content Sheet
      if (data?.content) {
        const contentLines = data?.content?.split('\n')?.filter(line => line?.trim());
        const contentData = [
          ['Line', 'Content']
        ];
        
        contentLines?.forEach((line, index) => {
          contentData?.push([index + 1, line]);
        });
        
        const contentSheet = XLSX?.utils?.aoa_to_sheet(contentData);
        contentSheet['!cols'] = [
          { width: 8 },  // Line number column
          { width: 100 } // Content column
        ];
        
        XLSX?.utils?.book_append_sheet(workbook, contentSheet, 'Content');
      }
      
    } else {
      // Template export
      const templateInfoData = [
        ['Field', 'Value'],
        ['Template Name', data?.name || ''],
        ['Category', data?.category || ''],
        ['Status', data?.status || ''],
        ['Description', data?.description || ''],
        ['Created Date', data?.createdDate ? format(new Date(data.createdDate), 'yyyy-MM-dd HH:mm:ss') : ''],
        ['Created By', data?.createdBy || ''],
        ['Last Modified', data?.lastModified ? format(new Date(data.lastModified), 'yyyy-MM-dd HH:mm:ss') : ''],
        ['Modified By', data?.modifiedBy || ''],
        ['Usage Count', data?.usageCount || 0],
        ['Version', data?.version || 1],
        ['Is Public', data?.isPublic ? 'Yes' : 'No'],
        ['Tags', data?.tags && Array.isArray(data?.tags) ? data?.tags?.join('; ') : ''],
        ['Element Count', data?.elements && Array.isArray(data?.elements) ? data?.elements?.length : 0],
        ['', ''], // Empty row
        ['EXPORT INFORMATION', ''],
        ['Exported Date', format(new Date(), 'yyyy-MM-dd HH:mm:ss')],
        ['Exported By', exportedBy],
        ['Format', 'Excel Spreadsheet (.xlsx)']
      ];
      
      const templateInfoSheet = XLSX?.utils?.aoa_to_sheet(templateInfoData);
      templateInfoSheet['!cols'] = [
        { width: 20 }, // Field column
        { width: 50 }  // Value column
      ];
      
      XLSX?.utils?.book_append_sheet(workbook, templateInfoSheet, 'Template Info');
      
      // Elements Sheet
      if (data?.elements && Array.isArray(data?.elements) && data?.elements?.length > 0) {
        const elementsData = [
          ['Element #', 'Name', 'Type', 'X Position', 'Y Position', 'Width', 'Height', 'Properties']
        ];
        
        data?.elements?.forEach((element, index) => {
          elementsData?.push([
            index + 1,
            element?.name || 'Unnamed Element',
            element?.type || 'Unknown',
            element?.x || 0,
            element?.y || 0,
            element?.width || 0,
            element?.height || 0,
            element?.properties ? JSON.stringify(element?.properties) : ''
          ]);
        });
        
        const elementsSheet = XLSX?.utils?.aoa_to_sheet(elementsData);
        elementsSheet['!cols'] = [
          { width: 12 }, // Element #
          { width: 25 }, // Name
          { width: 15 }, // Type
          { width: 12 }, // X Position
          { width: 12 }, // Y Position
          { width: 10 }, // Width
          { width: 10 }, // Height
          { width: 40 }  // Properties
        ];
        
        XLSX?.utils?.book_append_sheet(workbook, elementsSheet, 'Elements');
      }
      
      // Sections Sheet (if template has structured content)
      if (data?.templateContent && data?.templateContent?.sections && Array.isArray(data?.templateContent?.sections)) {
        const sectionsData = [
          ['Section #', 'Title', 'Field Count', 'Field Names', 'Field Types']
        ];
        
        data?.templateContent?.sections?.forEach((section, index) => {
          const fieldNames = section?.fields && Array.isArray(section?.fields) 
            ? section?.fields?.map(field => field?.label)?.join('; ')
            : '';
          const fieldTypes = section?.fields && Array.isArray(section?.fields)
            ? section?.fields?.map(field => field?.type)?.join('; ')
            : '';
            
          sectionsData?.push([
            index + 1,
            section?.title || 'Untitled Section',
            section?.fields && Array.isArray(section?.fields) ? section?.fields?.length : 0,
            fieldNames,
            fieldTypes
          ]);
        });
        
        const sectionsSheet = XLSX?.utils?.aoa_to_sheet(sectionsData);
        sectionsSheet['!cols'] = [
          { width: 12 }, // Section #
          { width: 25 }, // Title
          { width: 12 }, // Field Count
          { width: 40 }, // Field Names
          { width: 30 }  // Field Types
        ];
        
        XLSX?.utils?.book_append_sheet(workbook, sectionsSheet, 'Sections');
      }
    }
    
    // Write and save the file
    const excelBuffer = XLSX?.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, fileName);
    
    return { fileName, fileExtension: '.xlsx' };
    
  } catch (error) {
    console.error('Excel generation error:', error);
    throw error;
  }
};

/**
 * Export to plain text format
 */
const exportToText = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.txt`;
  let content = generateTextContent(data, type);
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, fileName);
  
  return { fileName, fileExtension: '.txt' };
};

/**
 * Export to HTML format
 */
const exportToHTML = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.html`;
  let content = generateHTMLContent(data, type);
  
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  saveAs(blob, fileName);
  
  return { fileName, fileExtension: '.html' };
};

/**
 * Export to RTF format
 */
const exportToRTF = async (data, type, baseFileName, timestamp) => {
  const fileName = `${baseFileName}_${timestamp}.rtf`;
  let content = generateRTFContent(data, type);
  
  const blob = new Blob([content], { type: 'text/rtf;charset=utf-8' });
  saveAs(blob, fileName);
  
  return { fileName, fileExtension: '.rtf' };
};

/**
 * Convert HTML element to PDF using html2canvas and jsPDF
 */
export const convertElementToPDF = async (element, filename = 'export.pdf') => {
  try {
    if (!element) {
      throw new Error('No element provided for conversion');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas?.toDataURL('image/png');
    const pdf = new jsPDF();
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas?.height * imgWidth) / canvas?.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf?.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf?.addPage();
      pdf?.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf?.save(filename);
    return { success: true, filename };
    
  } catch (error) {
    console.error('HTML to PDF conversion error:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Convert HTML element to image using html2canvas
 */
export const convertElementToImage = async (element, format = 'png', filename = 'export') => {
  try {
    if (!element) {
      throw new Error('No element provided for conversion');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const mimeType = `image/${format}`;
    const fullFilename = `${filename}.${format}`;
    
    canvas?.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fullFilename);
      }
    }, mimeType, 1.0);
    
    return { success: true, filename: fullFilename };
    
  } catch (error) {
    console.error('HTML to image conversion error:', error);
    return { success: false, error: error?.message };
  }
};

/**
 * Generate plain text content
 */
const generateTextContent = (data, type) => {
  const currentUser = getCurrentUser();
  const exportDate = format(new Date(), 'MMMM dd, yyyy HH:mm:ss');
  
  let exportedBy = 'System';
  if (currentUser) {
    if (currentUser?.data && currentUser?.data?.name) {
      exportedBy = currentUser?.data?.name;
    } else if (currentUser?.email) {
      exportedBy = currentUser?.email;
    }
  }
  
  if (type === 'document') {
    const title = data?.title || data?.documentName || 'Untitled Document';
    const titleLine = '='?.repeat(title?.length);
    
    let content = `${title?.toUpperCase()}\n${titleLine}\n\n`;
    content += `${data?.content || 'No content available'}\n\n`;
    content += '---\n\n';
    content += 'Document Information:\n';
    content += `Type: ${data?.documentType || 'General Document'}\n`;
    content += `Status: ${data?.status || 'Draft'}\n`;
    content += `Priority: ${data?.priority || 'Normal'}\n\n`;
    
    if (data?.patientInfo && data?.patientInfo?.name) {
      content += `Patient: ${data?.patientInfo?.name}\n`;
      if (data?.patientInfo?.dob) {
        content += `DOB: ${data?.patientInfo?.dob}\n`;
      }
      if (data?.patientInfo?.mrn) {
        content += `MRN: ${data?.patientInfo?.mrn}\n`;
      }
      content += '\n';
    }
    
    content += `Created: ${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy') : 'Unknown'}\n`;
    content += `By: ${data?.createdBy || 'Unknown'}\n\n`;
    content += `Last Modified: ${data?.lastModified ? format(new Date(data.lastModified), 'MMMM dd, yyyy') : 'Unknown'}\n`;
    content += `By: ${data?.modifiedBy || 'Unknown'}\n\n`;
    content += `Exported: ${exportDate}\n`;
    content += `By: ${exportedBy}\n`;
    
    return content;
    
  } else {
    const templateName = data?.name || 'Untitled Template';
    const titleLine = '='?.repeat(templateName?.length + 11);
    
    let content = `${templateName?.toUpperCase()} - TEMPLATE\n${titleLine}\n\n`;
    content += `Description: ${data?.description || 'No description available'}\n`;
    content += `Category: ${data?.category || 'General'}\n\n`;
    
    const elementCount = data?.elements && Array.isArray(data?.elements) ? data?.elements?.length : 0;
    content += `Template Elements (${elementCount}):\n`;
    
    if (data?.elements && Array.isArray(data?.elements)) {
      data?.elements?.forEach((element, index) => {
        const elementName = element?.name || 'Unnamed Element';
        const elementType = element?.type || 'Unknown type';
        content += `${index + 1}. ${elementName} (${elementType})\n`;
      });
    } else {
      content += 'No elements defined\n';
    }
    
    content += '\nSample Content:\n';
    content += `${data?.templateContent && data?.templateContent?.sampleContent ? data?.templateContent?.sampleContent : 'No sample content available'}\n\n`;
    
    content += `Created: ${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy') : 'Unknown'}\n`;
    content += `By: ${data?.createdBy || 'Unknown'}\n\n`;
    content += `Usage Count: ${data?.usageCount || 0}\n`;
    content += `Version: ${data?.version || 1}\n\n`;
    content += `Exported: ${exportDate}\n`;
    content += `By: ${exportedBy}\n`;
    
    return content;
  }
};

/**
 * Generate HTML content
 */
const generateHTMLContent = (data, type) => {
  const currentUser = getCurrentUser();
  const exportDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  let exportedBy = 'System';
  if (currentUser) {
    if (currentUser?.data && currentUser?.data?.name) {
      exportedBy = currentUser?.data?.name;
    } else if (currentUser?.email) {
      exportedBy = currentUser?.email;
    }
  }
  
  const baseHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data?.title || data?.name || 'Evolve Health Export'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #007bff; margin: 0; }
        .subtitle { color: #6c757d; margin: 5px 0 0 0; }
        .section { margin-bottom: 30px; }
        .section-title { color: #007bff; border-bottom: 1px solid #dee2e6; padding-bottom: 5px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 150px 1fr; gap: 10px; margin-bottom: 20px; }
        .info-label { font-weight: bold; color: #495057; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; white-space: pre-wrap; }
        .footer { border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 40px; color: #6c757d; font-size: 0.9em; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: bold; }
        .badge-primary { background: #007bff; color: white; }
        .badge-success { background: #28a745; color: white; }
        .badge-warning { background: #ffc107; color: #212529; }
        .badge-danger { background: #dc3545; color: white; }
        .element-list { list-style: none; padding: 0; }
        .element-item { background: white; padding: 15px; margin-bottom: 10px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    </style>
</head>
<body>`;

  if (type === 'document') {
    const title = data?.title || data?.documentName || 'Untitled Document';
    const priorityBadge = data?.priority === 'urgent' ? 'badge-danger' : data?.priority === 'high' ? 'badge-warning' : 'badge-success';
    
    let patientInfoSection = '';
    if (data?.patientInfo && data?.patientInfo?.name) {
      patientInfoSection = `
            <span class="info-label">Patient:</span>
            <span>${data?.patientInfo?.name}</span>`;
      
      if (data?.patientInfo?.dob) {
        patientInfoSection += `
            <span class="info-label">Date of Birth:</span>
            <span>${data?.patientInfo?.dob}</span>`;
      }
      
      if (data?.patientInfo?.mrn) {
        patientInfoSection += `
            <span class="info-label">MRN:</span>
            <span>${data?.patientInfo?.mrn}</span>`;
      }
    }
    
    let tagsSection = '';
    if (data?.tags && Array.isArray(data?.tags) && data?.tags?.length > 0) {
      const tagBadges = data?.tags?.map(tag => `<span class="badge badge-primary">${tag}</span>`)?.join(' ');
      tagsSection = `
            <span class="info-label">Tags:</span>
            <span>${tagBadges}</span>`;
    }
    
    return `${baseHTML}
    <div class="header">
        <h1 class="title">${title}</h1>
        <p class="subtitle">Healthcare Document - Exported from Evolve Health</p>
    </div>

    <div class="section">
        <h2 class="section-title">Document Information</h2>
        <div class="info-grid">
            <span class="info-label">Type:</span>
            <span>${data?.documentType || 'General Document'}</span>
            
            <span class="info-label">Status:</span>
            <span><span class="badge badge-primary">${data?.status || 'Draft'}</span></span>
            
            <span class="info-label">Priority:</span>
            <span><span class="badge ${priorityBadge}">${data?.priority || 'Normal'}</span></span>
            ${patientInfoSection}
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Content</h2>
        <div class="content">${data?.content || 'No content available'}</div>
    </div>

    <div class="section">
        <h2 class="section-title">Metadata</h2>
        <div class="info-grid">
            <span class="info-label">Created:</span>
            <span>${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</span>
            
            <span class="info-label">Created By:</span>
            <span>${data?.createdBy || 'Unknown'}</span>
            
            <span class="info-label">Last Modified:</span>
            <span>${data?.lastModified ? format(new Date(data.lastModified), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</span>
            
            <span class="info-label">Modified By:</span>
            <span>${data?.modifiedBy || 'Unknown'}</span>
            
            <span class="info-label">Word Count:</span>
            <span>${data?.metadata && data?.metadata?.wordCount ? data?.metadata?.wordCount : 0}</span>
            
            <span class="info-label">Version:</span>
            <span>${data?.version || 1}</span>
            ${tagsSection}
        </div>
    </div>

    <div class="footer">
        <p><strong>Export Information:</strong></p>
        <p>Exported: ${exportDate} | By: ${exportedBy} | Format: HTML</p>
        <p>Generated by Evolve Health Document Management System</p>
        <p>Original Document ID: ${data?.id || 'Unknown'}</p>
    </div>
</body>
</html>`;
  } else {
    const templateName = data?.name || 'Untitled Template';
    const elementCount = data?.elements && Array.isArray(data?.elements) ? data?.elements?.length : 0;
    
    let elementsHTML = '<li>No elements defined</li>';
    if (data?.elements && Array.isArray(data?.elements) && data?.elements?.length > 0) {
      elementsHTML = data?.elements?.map((element, index) => {
        const elementName = element?.name || 'Unnamed Element';
        const elementType = element?.type || 'Unknown';
        const elementX = element?.x || 0;
        const elementY = element?.y || 0;
        const elementWidth = element?.width || 0;
        const elementHeight = element?.height || 0;
        
        let propertiesHTML = '';
        if (element?.properties) {
          const props = Object.entries(element?.properties)?.map(([key, value]) => `${key}: ${value}`)?.join(', ');
          propertiesHTML = `<br>Properties: ${props}`;
        }
        
        return `
            <li class="element-item">
                <strong>${elementName}</strong>
                <br>Type: ${elementType} | Position: (${elementX}, ${elementY}) | Size: ${elementWidth} × ${elementHeight}
                ${propertiesHTML}
            </li>`;
      })?.join('');
    }
    
    let sampleContentSection = '';
    if (data?.templateContent && data?.templateContent?.sampleContent) {
      sampleContentSection = `
    <div class="section">
        <h2 class="section-title">Sample Content</h2>
        <div class="content">${data?.templateContent?.sampleContent}</div>
    </div>`;
    }
    
    let tagsSection = '';
    if (data?.tags && Array.isArray(data?.tags) && data?.tags?.length > 0) {
      const tagBadges = data?.tags?.map(tag => `<span class="badge badge-primary">${tag}</span>`)?.join(' ');
      tagsSection = `
            <span class="info-label">Tags:</span>
            <span>${tagBadges}</span>`;
    }
    
    return `${baseHTML}
    <div class="header">
        <h1 class="title">${templateName}</h1>
        <p class="subtitle">Healthcare Template - Exported from Evolve Health</p>
    </div>

    <div class="section">
        <h2 class="section-title">Template Information</h2>
        <div class="info-grid">
            <span class="info-label">Category:</span>
            <span>${data?.category || 'General'}</span>
            
            <span class="info-label">Status:</span>
            <span><span class="badge badge-primary">${data?.status || 'Draft'}</span></span>
            
            <span class="info-label">Description:</span>
            <span>${data?.description || 'No description available'}</span>
            
            <span class="info-label">Usage Count:</span>
            <span>${data?.usageCount || 0}</span>
            
            <span class="info-label">Public:</span>
            <span>${data?.isPublic ? 'Yes' : 'No'}</span>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">Template Elements (${elementCount})</h2>
        <ul class="element-list">
            ${elementsHTML}
        </ul>
    </div>

    ${sampleContentSection}

    <div class="section">
        <h2 class="section-title">Metadata</h2>
        <div class="info-grid">
            <span class="info-label">Created:</span>
            <span>${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</span>
            
            <span class="info-label">Created By:</span>
            <span>${data?.createdBy || 'Unknown'}</span>
            
            <span class="info-label">Last Modified:</span>
            <span>${data?.lastModified ? format(new Date(data.lastModified), 'MMMM dd, yyyy HH:mm') : 'Unknown'}</span>
            
            <span class="info-label">Modified By:</span>
            <span>${data?.modifiedBy || 'Unknown'}</span>
            
            <span class="info-label">Version:</span>
            <span>${data?.version || 1}</span>
            ${tagsSection}
        </div>
    </div>

    <div class="footer">
        <p><strong>Export Information:</strong></p>
        <p>Exported: ${exportDate} | By: ${exportedBy} | Format: HTML</p>
        <p>Generated by Evolve Health Template Management System</p>
        <p>Original Template ID: ${data?.id || 'Unknown'}</p>
    </div>
</body>
</html>`;
  }
};

/**
 * Generate RTF content
 */
const generateRTFContent = (data, type) => {
  const currentUser = getCurrentUser();
  const exportDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  let exportedBy = 'System';
  if (currentUser) {
    if (currentUser?.data && currentUser?.data?.name) {
      exportedBy = currentUser?.data?.name;
    } else if (currentUser?.email) {
      exportedBy = currentUser?.email;
    }
  }
  
  if (type === 'document') {
    const title = data?.title || data?.documentName || 'Untitled Document';
    let patientInfo = '';
    if (data?.patientInfo && data?.patientInfo?.name) {
      patientInfo = `{\\b Patient:} ${data?.patientInfo?.name}\\par`;
      if (data?.patientInfo?.dob) {
        patientInfo += `{\\b Date of Birth:} ${data?.patientInfo?.dob}\\par`;
      }
      if (data?.patientInfo?.mrn) {
        patientInfo += `{\\b MRN:} ${data?.patientInfo?.mrn}\\par`;
      }
    }
    
    let tags = '';
    if (data?.tags && Array.isArray(data?.tags) && data?.tags?.length > 0) {
      tags = `{\\b Tags:} ${data?.tags?.join(', ')}\\par`;
    }
    
    let content = data?.content || 'No content available';
    const contentRTF = content?.replace(/\n/g, '\\par');
    
    return `{\\rtf1\\ansi\\deff0 
{\\fonttbl {\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green123\\blue255;\\red102\\green102\\blue102;}
\\f0\\fs24

{\\b\\cf1\\fs32 ${title}}\\par
\\cf2\\fs18 Healthcare Document - Exported from Evolve Health\\par\\par

{\\b\\cf1\\fs28 Document Information}\\par
{\\b Type:} ${data?.documentType || 'General Document'}\\par
{\\b Status:} ${data?.status || 'Draft'}\\par
{\\b Priority:} ${data?.priority || 'Normal'}\\par
${patientInfo}
\\par

{\\b\\cf1\\fs28 Content}\\par
${contentRTF}\\par\\par

{\\b\\cf1\\fs28 Metadata}\\par
{\\b Created:} ${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy HH:mm') : 'Unknown'}\\par
{\\b Created By:} ${data?.createdBy || 'Unknown'}\\par
{\\b Last Modified:} ${data?.lastModified ? format(new Date(data.lastModified), 'MMMM dd, yyyy HH:mm') : 'Unknown'}\\par
{\\b Modified By:} ${data?.modifiedBy || 'Unknown'}\\par
{\\b Word Count:} ${data?.metadata && data?.metadata?.wordCount ? data?.metadata?.wordCount : 0}\\par
{\\b Version:} ${data?.version || 1}\\par
${tags}
\\par

\\cf2\\fs16 Exported: ${exportDate} | By: ${exportedBy} | Format: RTF\\par
Generated by Evolve Health Document Management System\\par
Original Document ID: ${data?.id || 'Unknown'}\\par
}`;
  } else {
    const templateName = data?.name || 'Untitled Template';
    
    let elementsRTF = 'No elements defined\\par';
    if (data?.elements && Array.isArray(data?.elements) && data?.elements?.length > 0) {
      elementsRTF = data?.elements?.map((element, index) => {
        const elementName = element?.name || 'Unnamed Element';
        const elementType = element?.type || 'Unknown';
        const elementX = element?.x || 0;
        const elementY = element?.y || 0;
        const elementWidth = element?.width || 0;
        const elementHeight = element?.height || 0;
        
        let properties = '';
        if (element?.properties) {
          const props = Object.entries(element?.properties)?.map(([key, value]) => `${key}: ${value}`)?.join(', ');
          properties = `Properties: ${props}\\par`;
        }
        
        return `
${index + 1}. {\\b ${elementName}}\\par
   Type: ${elementType} | Position: (${elementX}, ${elementY}) | Size: ${elementWidth} × ${elementHeight}\\par
   ${properties}`;
      })?.join('');
    }
    
    let sampleContent = '';
    if (data?.templateContent && data?.templateContent?.sampleContent) {
      const sampleContentRTF = data?.templateContent?.sampleContent?.replace(/\n/g, '\\par');
      sampleContent = `{\\b\\cf1\\fs28 Sample Content}\\par
${sampleContentRTF}\\par\\par`;
    }
    
    let tags = '';
    if (data?.tags && Array.isArray(data?.tags) && data?.tags?.length > 0) {
      tags = `{\\b Tags:} ${data?.tags?.join(', ')}\\par`;
    }
    
    return `{\\rtf1\\ansi\\deff0 
{\\fonttbl {\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green123\\blue255;\\red102\\green102\\blue102;}
\\f0\\fs24

{\\b\\cf1\\fs32 ${templateName}}\\par
\\cf2\\fs18 Healthcare Template - Exported from Evolve Health\\par\\par

{\\b\\cf1\\fs28 Template Information}\\par
{\\b Category:} ${data?.category || 'General'}\\par
{\\b Status:} ${data?.status || 'Draft'}\\par
{\\b Description:} ${data?.description || 'No description available'}\\par
{\\b Usage Count:} ${data?.usageCount || 0}\\par
{\\b Public:} ${data?.isPublic ? 'Yes' : 'No'}\\par
\\par

{\\b\\cf1\\fs28 Template Elements (${data?.elements && Array.isArray(data?.elements) ? data?.elements?.length : 0})}\\par
${elementsRTF}
\\par

${sampleContent}

{\\b\\cf1\\fs28 Metadata}\\par
{\\b Created:} ${data?.createdDate ? format(new Date(data.createdDate), 'MMMM dd, yyyy HH:mm') : 'Unknown'}\\par
{\\b Created By:} ${data?.createdBy || 'Unknown'}\\par
{\\b Last Modified:} ${data?.lastModified ? format(new Date(data.lastModified), 'MMMM dd, yyyy HH:mm') : 'Unknown'}\\par
{\\b Modified By:} ${data?.modifiedBy || 'Unknown'}\\par
{\\b Version:} ${data?.version || 1}\\par
${tags}
\\par

\\cf2\\fs16 Exported: ${exportDate} | By: ${exportedBy} | Format: RTF\\par
Generated by Evolve Health Template Management System\\par
Original Template ID: ${data?.id || 'Unknown'}\\par
}`;
  }
};

/**
 * Validate export data before processing with improved validation
 * @param {Object} data - Data to validate
 * @param {string} type - Type of data ('document' or 'template')
 * @returns {Object} Validation result
 */
export const validateExportData = (data, type) => {
  const errors = [];
  
  if (!data) {
    errors?.push('No data provided for export');
    return { isValid: false, errors };
  }
  
  if (type === 'document') {
    if (!data?.title && !data?.documentName && !data?.name) {
      errors?.push('Document must have a title');
    }
    if (!data?.content || (typeof data?.content === 'string' && data?.content?.trim()?.length === 0)) {
      errors?.push('Document must have content');
    }
  } else if (type === 'template') {
    if (!data?.name) {
      errors?.push('Template must have a name');
    }
    // Allow templates without elements for basic templates
    if (!data?.elements && !data?.templateContent) {
      errors?.push('Template must have elements or content');
    }
  }
  
  return {
    isValid: errors?.length === 0,
    errors
  };
};

/**
 * Enhanced format support with better type detection
 * @returns {Array} Array of supported formats
 */
export const getSupportedFormats = () => {
  return ['pdf', 'docx', 'xlsx', 'txt', 'html', 'rtf'];
};

/**
 * Get format display names with proper descriptions
 * @returns {Object} Object mapping format codes to display names
 */
export const getFormatDisplayNames = () => {
  return {
    pdf: 'PDF Document',
    docx: 'Word Document',
    xlsx: 'Excel Spreadsheet', 
    txt: 'Plain Text',
    html: 'Web Page (HTML)',
    rtf: 'Rich Text Format'
  };
};

/**
 * Get format icons for UI display
 * @returns {Object} Object mapping format codes to icon names
 */
export const getFormatIcons = () => {
  return {
    pdf: 'FileText',
    docx: 'FileType',
    xlsx: 'Table',
    txt: 'Type',
    html: 'Globe',
    rtf: 'FileText'
  };
};

/**
 * Get format colors for UI consistency
 * @returns {Object} Object mapping format codes to color classes
 */
export const getFormatColors = () => {
  return {
    pdf: 'text-red-600',
    docx: 'text-blue-600',
    xlsx: 'text-green-600',
    txt: 'text-gray-600',
    html: 'text-orange-600',
    rtf: 'text-purple-600'
  };
};

/**
 * Check if a format supports rich content
 * @param {string} format - Format to check
 * @returns {boolean} Whether format supports rich content
 */
export const supportsRichContent = (format) => {
  const richFormats = ['pdf', 'docx', 'html', 'rtf'];
  return richFormats?.includes(format?.toLowerCase());
};

/**
 * Get estimated file size for format
 * @param {Object} data - Data to export
 * @param {string} format - Export format
 * @returns {string} Estimated file size description
 */
export const getEstimatedFileSize = (data, format) => {
  const contentLength = (data?.content?.length || 0) + (data?.name?.length || 0);
  
  const multipliers = {
    txt: 1,
    html: 1.2,
    rtf: 1.5,
    pdf: 2,
    docx: 1.8,
    xlsx: 1.3
  };
  
  const estimatedBytes = contentLength * (multipliers?.[format] || 1);
  
  if (estimatedBytes < 1024) {
    return `~${estimatedBytes} bytes`;
  } else if (estimatedBytes < 1024 * 1024) {
    return `~${(estimatedBytes / 1024)?.toFixed(1)} KB`;
  } else {
    return `~${(estimatedBytes / (1024 * 1024))?.toFixed(1)} MB`;
  }
};