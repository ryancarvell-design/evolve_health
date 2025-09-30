import { supabase } from '../lib/supabase';

class DocumentService {
  // Upload and process document
  async uploadDocument(file, title, description) {
    try {
      const { data: { user }, error: userError } = await supabase?.auth?.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Generate unique file path
      const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();
      const fileName = `${user?.id}/${Date?.now()}_${file?.name}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('documents')?.upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Create document record
      const documentData = {
        user_id: user?.id,
        title: title || file?.name,
        description: description || '',
        document_type: this.getDocumentType(fileExtension),
        file_path: uploadData?.path,
        file_size: file?.size,
        status: 'processing'
      };

      const { data: docData, error: docError } = await supabase?.from('documents')?.insert(documentData)?.select()?.single();

      if (docError) throw docError;

      // Start processing for PDFs
      if (fileExtension === 'pdf') {
        await this.processPDFDocument(docData?.id, uploadData?.path);
      }

      return docData;
    } catch (error) {
      throw new Error(`Upload failed: ${error?.message}`);
    }
  }

  // Process PDF document (extract pages and content)
  async processPDFDocument(documentId, filePath) {
    try {
      // Get signed URL for processing
      const { data: urlData, error: urlError } = await supabase?.storage?.from('documents')?.createSignedUrl(filePath, 3600);

      if (urlError) throw urlError;

      // This would typically call a backend service or Edge function
      // For now, we'll simulate the processing
      const processedData = await this.simulateBackendProcessing(urlData?.signedUrl);

      // Update document status
      await supabase?.from('documents')?.update({
          status: 'completed',
          page_count: processedData?.pages?.length,
          processed_content: processedData
        })?.eq('id', documentId);

      // Store processed pages
      if (processedData?.pages?.length > 0) {
        const pageInserts = processedData?.pages?.map((page, index) => ({
          document_id: documentId,
          page_number: index + 1,
          content: page?.text || '',
          annotations: []
        }));

        const { error: pagesError } = await supabase?.from('pdf_pages')?.insert(pageInserts);

        if (pagesError) {
          console.error('Error inserting pages:', pagesError);
        }
      }

      return processedData;
    } catch (error) {
      // Update document status to failed
      await supabase?.from('documents')?.update({ status: 'failed' })?.eq('id', documentId);
      
      throw new Error(`PDF processing failed: ${error?.message}`);
    }
  }

  // Simulate backend processing (replace with actual service call)
  async simulateBackendProcessing(pdfUrl) {
    // In a real implementation, this would:
    // 1. Call your backend API or Edge function
    // 2. Use PDF processing libraries (pdf-poppler, pdf2pic, etc.)
    // 3. Extract text using OCR if needed
    // 4. Generate page images
    // 5. Return structured data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalPages: 5,
          pages: [
            { pageNumber: 1, text: 'Page 1 content extracted from PDF...', imageUrl: null },
            { pageNumber: 2, text: 'Page 2 content with detailed information...', imageUrl: null },
            { pageNumber: 3, text: 'Page 3 contains charts and analysis...', imageUrl: null },
            { pageNumber: 4, text: 'Page 4 methodology and results section...', imageUrl: null },
            { pageNumber: 5, text: 'Page 5 conclusions and references...', imageUrl: null }
          ],
          metadata: {
            author: 'System Extracted',
            creationDate: new Date()?.toISOString(),
            extractionDate: new Date()?.toISOString()
          }
        });
      }, 2000); // Simulate processing time
    });
  }

  // Get user documents
  async getUserDocuments() {
    try {
      const { data, error } = await supabase?.from('documents')?.select(`
          *,
          pdf_pages!inner(count)
        `)?.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch documents: ${error?.message}`);
    }
  }

  // Get document with pages
  async getDocumentWithPages(documentId) {
    try {
      const { data: document, error: docError } = await supabase?.from('documents')?.select('*')?.eq('id', documentId)?.single();

      if (docError) throw docError;

      const { data: pages, error: pagesError } = await supabase?.from('pdf_pages')?.select('*')?.eq('document_id', documentId)?.order('page_number');

      if (pagesError) throw pagesError;

      return { ...document, pages: pages || [] };
    } catch (error) {
      throw new Error(`Failed to fetch document: ${error?.message}`);
    }
  }

  // Update page content
  async updatePageContent(pageId, content, annotations = []) {
    try {
      const { data, error } = await supabase?.from('pdf_pages')?.update({
          content,
          annotations,
          updated_at: new Date()?.toISOString()
        })?.eq('id', pageId)?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to update page: ${error?.message}`);
    }
  }

  // Save document version
  async saveDocumentVersion(documentId, content, changesSummary) {
    try {
      const { data: { user }, error: userError } = await supabase?.auth?.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Get current version number
      const { data: lastVersion } = await supabase?.from('document_versions')?.select('version_number')?.eq('document_id', documentId)?.order('version_number', { ascending: false })?.limit(1)?.single();

      const newVersionNumber = (lastVersion?.version_number || 0) + 1;

      const { data, error } = await supabase?.from('document_versions')?.insert({
          document_id: documentId,
          version_number: newVersionNumber,
          content,
          changes_summary: changesSummary,
          created_by: user?.id
        })?.select()?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to save version: ${error?.message}`);
    }
  }

  // Delete document
  async deleteDocument(documentId) {
    try {
      // Get document info
      const { data: document, error: docError } = await supabase?.from('documents')?.select('file_path')?.eq('id', documentId)?.single();

      if (docError) throw docError;

      // Delete file from storage
      if (document?.file_path) {
        const { error: storageError } = await supabase?.storage?.from('documents')?.remove([document?.file_path]);
        
        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      // Delete document record (cascades to pages and versions)
      const { error: deleteError } = await supabase?.from('documents')?.delete()?.eq('id', documentId);

      if (deleteError) throw deleteError;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete document: ${error?.message}`);
    }
  }

  // Get document signed URL for download
  async getDocumentDownloadUrl(filePath) {
    try {
      const { data, error } = await supabase?.storage?.from('documents')?.createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data?.signedUrl;
    } catch (error) {
      throw new Error(`Failed to get download URL: ${error?.message}`);
    }
  }

  // Export document as PDF
  async exportDocumentAsPDF(documentId) {
    try {
      const documentData = await this.getDocumentWithPages(documentId);
      
      // This would integrate with PDF generation library
      // For now, return the original file URL
      if (documentData?.file_path) {
        return await this.getDocumentDownloadUrl(documentData?.file_path);
      }
      
      throw new Error('Document file not found');
    } catch (error) {
      throw new Error(`Export failed: ${error?.message}`);
    }
  }

  // Utility methods
  getDocumentType(extension) {
    const typeMap = {
      'pdf': 'pdf',
      'doc': 'word',
      'docx': 'word',
      'txt': 'text'
    };
    return typeMap?.[extension] || 'other';
  }

  // Real-time subscription for document updates
  subscribeToDocument(documentId, callback) {
    return supabase?.channel(`document_${documentId}`)?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pdf_pages',
          filter: `document_id=eq.${documentId}`
        },
        callback
      )?.subscribe();
  }

  // Unsubscribe from document updates
  unsubscribeFromDocument(subscription) {
    return supabase?.removeChannel(subscription);
  }
}

export default new DocumentService();