-- Fix storage RLS policies for document uploads
-- This addresses the "please sign in" error during uploads

-- RLS Policy: Allow authenticated users to view their own uploaded files
CREATE POLICY "users_can_view_own_documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents' 
    AND owner = auth.uid()
);

-- RLS Policy: Allow authenticated users to upload files to their user folder
CREATE POLICY "users_can_upload_documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents'
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Allow users to update their own files (for metadata updates)
CREATE POLICY "users_can_update_own_documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documents' 
    AND owner = auth.uid()
)
WITH CHECK (
    bucket_id = 'documents' 
    AND owner = auth.uid()
);

-- RLS Policy: Allow users to delete their own files
CREATE POLICY "users_can_delete_own_documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'documents' 
    AND owner = auth.uid()
);

-- Create corresponding user profile for Lauren Carvell
-- Using INSERT with WHERE NOT EXISTS to avoid conflicts
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
)
SELECT 
    'c4ca4238-a0b9-4382-8dcc-509a6f75849b'::uuid,
    'lauren.carvell@evolvehealth.com',
    'Lauren Carvell',
    'member'::user_role,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE email = 'lauren.carvell@evolvehealth.com'
);