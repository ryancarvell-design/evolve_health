// PDF Utilities with secure worker configuration
import * as pdfjsLib from 'pdfjs-dist';

// Secure PDF.js configuration utility
export const configurePDFWorker = () => {
  if (typeof window !== 'undefined' && !pdfjsLib?.GlobalWorkerOptions?.workerSrc) {
    // Set worker source based on environment
    const workerSrc = import.meta.env?.PROD 
      ? 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      : 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    console.log('PDF.js worker configured:', workerSrc);
  }
};

// Initialize PDF.js with secure settings
export const initializePDFSecurely = () => {
  configurePDFWorker();
  
  // Additional security configurations
  if (typeof pdfjsLib?.GlobalWorkerOptions !== 'undefined') {
    // Disable certain features that might use eval()
    pdfjsLib.GlobalWorkerOptions.verbosity = pdfjsLib?.VerbosityLevel?.ERRORS;
  }
};

// Enhanced PDF document loading with better configuration
export const loadPDFDocument = async (file, options = {}) => {
  // Ensure worker is configured
  configurePDFWorker();
  
  try {
    const arrayBuffer = await file?.arrayBuffer();
    
    // Use environment variables if available, fallback to CDN
    const workerSrc = import.meta.env?.VITE_PDFJS_WORKER_SRC || 
                     'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const cMapUrl = import.meta.env?.VITE_PDFJS_CMAPS_URL || 
                   'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/';
    
    console.log('PDF.js Configuration:', {
      workerSrc,
      cMapUrl,
      secureMode: import.meta.env?.VITE_SECURE_PDF_MODE === 'true'
    });
    
    const loadingTask = pdfjsLib?.getDocument({
      data: arrayBuffer,
      cMapUrl: cMapUrl,
      cMapPacked: true,
      // Enhanced security and performance options
      verbosity: import.meta.env?.NODE_ENV === 'development' ? 
                 pdfjsLib?.VerbosityLevel?.WARNINGS : 
                 pdfjsLib?.VerbosityLevel?.ERRORS,
      enableXfa: false, // Disable XFA forms
      disableRange: false,
      disableStream: false,
      disableAutoFetch: false,
      pdfBug: false,
      // Security options
      isEvalSupported: import.meta.env?.VITE_DISABLE_EVAL !== 'true',
      maxImageSize: 1024 * 1024 * 50, // 50MB max image size
      disableFontFace: false,
      useSystemFonts: true,
      ...options
    });

    const pdf = await loadingTask?.promise;
    console.log(`PDF loaded successfully: ${pdf?.numPages} pages, PDF version: ${pdf?._pdfInfo?.PDFFormatVersion}`);
    
    return pdf;
  } catch (error) {
    console.error('Error loading PDF document:', error);
    
    // Enhanced error handling with specific cases
    if (error?.message?.includes('Invalid PDF structure')) {
      throw new Error('The PDF file appears to be corrupted or has an invalid structure.');
    } else if (error?.message?.includes('Password')) {
      throw new Error('This PDF is password-protected. Please use an unprotected PDF file.');
    } else if (error?.message?.includes('worker')) {
      throw new Error('PDF processing failed due to worker initialization. Please refresh the page and try again.');
    } else {
      throw new Error(`Failed to load PDF: ${error?.message || 'Unknown error occurred'}`);
    }
  }
};

// Utility to check PDF.js worker status
export const checkPDFWorkerStatus = () => {
  return {
    workerSrc: pdfjsLib?.GlobalWorkerOptions?.workerSrc,
    isConfigured: Boolean(pdfjsLib?.GlobalWorkerOptions?.workerSrc),
    environment: import.meta.env?.MODE
  };
};

// Error handling utility for PDF operations
export const handlePDFError = (error, context = 'PDF operation') => {
  console.error(`${context} failed:`, error);
  
  if (error?.message?.includes('worker')) {
    return {
      type: 'worker_error',
      message: 'PDF worker failed to load. Please refresh the page and try again.',
      suggestion: 'Check your internet connection and ensure external resources can be loaded.'
    };
  } else if (error?.message?.includes('Invalid PDF') || error?.message?.includes('corrupted')) {
    return {
      type: 'invalid_pdf',
      message: 'The PDF file appears to be corrupted or invalid.',
      suggestion: 'Please try with a different PDF file.'
    };
  } else if (error?.message?.includes('password') || error?.message?.includes('encrypted')) {
    return {
      type: 'encrypted_pdf',
      message: 'This PDF is password-protected.',
      suggestion: 'Please use an unprotected PDF file.'
    };
  } else {
    return {
      type: 'general_error',
      message: `PDF processing failed: ${error?.message}`,
      suggestion: 'Please try again with a different file or refresh the page.'
    };
  }
};

export default {
  configurePDFWorker,
  initializePDFSecurely,
  loadPDFDocument,
  checkPDFWorkerStatus,
  handlePDFError
};