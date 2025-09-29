import { supabase } from './supabaseClient';

// PDF file validation utility
export const validatePDFFile = (file, maxSize = 10 * 1024 * 1024) => {
  const errors = [];

  if (!file) {
    errors?.push('No file provided');
    return errors;
  }

  // Check file type
  if (file?.type !== 'application/pdf') {
    errors?.push('File must be a PDF document');
  }

  // Check file size
  if (file?.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors?.push(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check file name
  if (!file?.name || file?.name?.trim() === '') {
    errors?.push('File must have a valid name');
  }

  if (file?.name?.length > 200) {
    errors?.push('File name is too long');
  }

  return errors;
};

// Generate secure file path for PDF storage
export const generatePDFPath = (fileName, userId, category = 'documents') => {
  const timestamp = Date.now();
  const sanitizedName = fileName?.replace(/[^a-zA-Z0-9.-]/g, '_')?.toLowerCase();
  return `${userId}/${category}/pdfs/${timestamp}_${sanitizedName}`;
};

// Upload PDF to Supabase Storage
export const uploadPDFToStorage = async (file, bucketName = 'documents', folderPath = '') => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase?.auth?.getUser();
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    // Validate file
    const validationErrors = validatePDFFile(file);
    if (validationErrors?.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    // Generate file path
    const filePath = folderPath ? 
      `${user?.id}/${folderPath}/pdfs/${Date.now()}_${file?.name?.replace(/[^a-zA-Z0-9.-]/g, '_')}` :
      generatePDFPath(file?.name, user?.id);

    // Upload file
    const { data: uploadData, error: uploadError } = await supabase?.storage?.from(bucketName)?.upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          'original-name': file?.name,
          'content-type': file?.type,
          'uploaded-by': user?.id,
          'upload-timestamp': new Date()?.toISOString(),
          'file-category': 'pdf-document'
        }
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Try to get signed URL (for private buckets)
    const { data: signedUrlData, error: signedUrlError } = await supabase?.storage?.from(bucketName)?.createSignedUrl(uploadData?.path, 3600 * 24 * 7); // 7 days

    let fileUrl = null;
    let isPublic = false;

    if (signedUrlError) {
      // Try public URL if signed URL fails
      const { data: publicUrlData } = supabase?.storage?.from(bucketName)?.getPublicUrl(uploadData?.path);
      
      fileUrl = publicUrlData?.publicUrl;
      isPublic = true;
    } else {
      fileUrl = signedUrlData?.signedUrl;
      isPublic = false;
    }

    return {
      success: true,
      data: {
        filePath: uploadData?.path,
        fileUrl: fileUrl,
        originalName: file?.name,
        size: file?.size,
        contentType: file?.type,
        isPublic: isPublic,
        uploadedBy: user?.id,
        uploadedAt: new Date()?.toISOString()
      }
    };

  } catch (error) {
    console.error('PDF upload error:', error);
    return {
      success: false,
      error: error?.message
    };
  }
};

// Get PDF file from storage (with signed URL for private buckets)
export const getPDFFromStorage = async (filePath, bucketName = 'documents') => {
  try {
    // Try to get signed URL first
    const { data: signedUrlData, error: signedUrlError } = await supabase?.storage?.from(bucketName)?.createSignedUrl(filePath, 3600); // 1 hour expiry

    if (signedUrlError) {
      // Try public URL if signed URL fails
      const { data: publicUrlData } = supabase?.storage?.from(bucketName)?.getPublicUrl(filePath);
      
      return {
        success: true,
        fileUrl: publicUrlData?.publicUrl,
        isPublic: true
      };
    }

    return {
      success: true,
      fileUrl: signedUrlData?.signedUrl,
      isPublic: false
    };

  } catch (error) {
    console.error('PDF retrieval error:', error);
    return {
      success: false,
      error: error?.message
    };
  }
};

// List user's PDF files from storage
export const listUserPDFs = async (bucketName = 'documents', folderPath = 'pdfs') => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase?.auth?.getUser();
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    // List files in user's PDF folder
    const userFolderPath = `${user?.id}/${folderPath}`;
    const { data: files, error: listError } = await supabase?.storage?.from(bucketName)?.list(userFolderPath, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    // Filter PDF files and generate URLs
    const pdfFiles = files?.filter(file => file?.name?.toLowerCase()?.endsWith('.pdf'));
    
    const filesWithUrls = await Promise.all(
      pdfFiles?.map(async (file) => {
        const fullPath = `${userFolderPath}/${file?.name}`;
        const urlResult = await getPDFFromStorage(fullPath, bucketName);
        
        return {
          id: file?.id,
          name: file?.name,
          size: file?.metadata?.size || 0,
          createdAt: file?.created_at,
          updatedAt: file?.updated_at,
          fullPath: fullPath,
          fileUrl: urlResult?.success ? urlResult?.fileUrl : null,
          isPublic: urlResult?.isPublic || false,
          originalName: file?.metadata?.['original-name'] || file?.name
        };
      })
    );

    return {
      success: true,
      files: filesWithUrls?.filter(file => file?.fileUrl) // Only return files with valid URLs
    };

  } catch (error) {
    console.error('List PDFs error:', error);
    return {
      success: false,
      error: error?.message,
      files: []
    };
  }
};

// Delete PDF from storage
export const deletePDFFromStorage = async (filePath, bucketName = 'documents') => {
  try {
    const { error } = await supabase?.storage?.from(bucketName)?.remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return {
      success: true,
      message: 'PDF deleted successfully'
    };

  } catch (error) {
    console.error('PDF deletion error:', error);
    return {
      success: false,
      error: error?.message
    };
  }
};

// Download PDF file
export const downloadPDF = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    if (!response?.ok) {
      throw new Error('Failed to fetch file');
    }

    const blob = await response?.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document.pdf';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: 'Download started'
    };

  } catch (error) {
    console.error('PDF download error:', error);
    return {
      success: false,
      error: error?.message
    };
  }
};

// Convert text content to PDF (basic implementation)
export const convertTextToPDF = async (content, title = 'Document') => {
  try {
    // This is a placeholder for PDF generation
    // In a real implementation, you might use jsPDF or a server-side solution
    
    // For now, return a simple PDF creation approach
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Add title
    doc?.setFontSize(16);
    doc?.text(title, 20, 20);
    
    // Add content (basic text wrapping)
    doc?.setFontSize(12);
    const splitText = doc?.splitTextToSize(content, 170);
    doc?.text(splitText, 20, 40);
    
    // Return as blob
    const pdfBlob = doc?.output('blob');
    
    return {
      success: true,
      blob: pdfBlob,
      fileName: `${title?.replace(/[^a-z0-9]/gi, '_')}.pdf`
    };
    
  } catch (error) {
    console.error('PDF conversion error:', error);
    return {
      success: false,
      error: error?.message
    };
  }
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
};

// Extract text from PDF (requires PDF.js)
export const extractTextFromPDF = async (file) => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configure PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib?.version}/build/pdf.worker.min.js`;
    
    const arrayBuffer = await file?.arrayBuffer();
    const pdf = await pdfjsLib?.getDocument({ data: arrayBuffer })?.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf?.numPages; pageNum++) {
      const page = await pdf?.getPage(pageNum);
      const textContent = await page?.getTextContent();
      const pageText = textContent?.items?.map(item => item?.str)?.join(' ');
      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
    }
    
    return {
      success: true,
      text: fullText?.trim(),
      pages: pdf?.numPages
    };
    
  } catch (error) {
    console.error('PDF text extraction error:', error);
    return {
      success: false,
      error: error?.message
    };
  }
};

export default {
  validatePDFFile,
  generatePDFPath,
  uploadPDFToStorage,
  getPDFFromStorage,
  listUserPDFs,
  deletePDFFromStorage,
  downloadPDF,
  convertTextToPDF,
  formatFileSize,
  extractTextFromPDF
};