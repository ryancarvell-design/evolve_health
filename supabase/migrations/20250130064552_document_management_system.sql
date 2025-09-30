-- Document Management System with PDF Processing
-- Schema Analysis: No existing schema - Fresh project setup
-- Integration Type: New complete system
-- Dependencies: None (fresh start)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.document_status AS ENUM ('draft', 'processing', 'completed', 'failed');
CREATE TYPE public.document_type AS ENUM ('pdf', 'word', 'text', 'other');

-- 2. Core User Table (Required for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Documents Table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    document_type public.document_type DEFAULT 'pdf'::public.document_type,
    file_path TEXT, -- Storage path for original file
    processed_content JSONB, -- Structured content after processing
    status public.document_status DEFAULT 'draft'::public.document_status,
    file_size BIGINT,
    page_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. PDF Pages Table (For page-by-page editing)
CREATE TABLE public.pdf_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    content TEXT, -- Extracted text content
    annotations JSONB DEFAULT '[]'::JSONB, -- User annotations and edits
    image_url TEXT, -- Rendered page image URL
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Document Versions Table (Track editing history)
CREATE TABLE public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    content JSONB NOT NULL,
    changes_summary TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_pdf_pages_document_id ON public.pdf_pages(document_id);
CREATE INDEX idx_pdf_pages_page_number ON public.pdf_pages(document_id, page_number);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);

-- 7. Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']),
    ('processed-images', 'processed-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- 8. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdf_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- 9. Helper Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Update document timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. RLS Policies
-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for documents
CREATE POLICY "users_manage_own_documents"
ON public.documents
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admin access for documents
CREATE POLICY "admin_full_access_documents"
ON public.documents
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Pattern 2: User ownership for PDF pages
CREATE POLICY "users_manage_own_pdf_pages"
ON public.pdf_pages
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = pdf_pages.document_id AND d.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = pdf_pages.document_id AND d.user_id = auth.uid()
    )
);

-- Pattern 2: User ownership for document versions
CREATE POLICY "users_manage_own_document_versions"
ON public.document_versions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = document_versions.document_id AND d.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.documents d 
        WHERE d.id = document_versions.document_id AND d.user_id = auth.uid()
    )
);

-- 11. Storage RLS Policies
-- Documents bucket - private user storage
CREATE POLICY "users_view_own_documents_storage"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid());

CREATE POLICY "users_upload_own_documents_storage"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_update_own_documents_storage"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid())
WITH CHECK (bucket_id = 'documents' AND owner = auth.uid());

CREATE POLICY "users_delete_own_documents_storage"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND owner = auth.uid());

-- Processed images bucket - private user storage
CREATE POLICY "users_view_own_processed_images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'processed-images' AND owner = auth.uid());

CREATE POLICY "users_upload_own_processed_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'processed-images' 
    AND owner = auth.uid()
);

CREATE POLICY "users_delete_own_processed_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'processed-images' AND owner = auth.uid());

-- 12. Triggers
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON public.documents 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pdf_pages_updated_at 
    BEFORE UPDATE ON public.pdf_pages 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Automatic user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    doc_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@evolvehealth.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'doctor@evolvehealth.com', crypt('doctor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Sarah Johnson", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Sample documents
    INSERT INTO public.documents (id, user_id, title, description, document_type, status, page_count)
    VALUES
        (doc_uuid, admin_uuid, 'Medical Research Paper', 'Advanced study on healthcare innovations', 'pdf'::public.document_type, 'completed'::public.document_status, 15),
        (gen_random_uuid(), user_uuid, 'Patient Care Guidelines', 'Comprehensive patient care protocols', 'pdf'::public.document_type, 'draft'::public.document_status, 8);

    -- Sample PDF pages for the first document
    INSERT INTO public.pdf_pages (document_id, page_number, content, annotations)
    VALUES
        (doc_uuid, 1, 'Introduction: This research paper explores innovative approaches to modern healthcare delivery...', '[]'::jsonb),
        (doc_uuid, 2, 'Methodology: Our study employed a comprehensive analysis of patient data from multiple sources...', '[]'::jsonb),
        (doc_uuid, 3, 'Results: The findings indicate significant improvements in patient outcomes when utilizing...', '[{"type": "highlight", "text": "significant improvements", "color": "yellow"}]'::jsonb);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;