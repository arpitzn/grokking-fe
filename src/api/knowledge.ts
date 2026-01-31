import { apiClient } from './client';
import { API_BASE_URL, ENDPOINTS } from '@/utils/constants';
import type { KnowledgeUploadResponse, Document, ApiError } from '@/types';
import type { DocumentFilters } from '@/utils/filters';

/**
 * Upload file(s) for RAG indexing using multipart/form-data with filters
 * Handles both single and multiple file uploads via upload-multiple endpoint
 */
export async function uploadFiles(
  userId: string,
  files: File[],
  filters: DocumentFilters
): Promise<KnowledgeUploadResponse | KnowledgeUploadResponse[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('user_id', userId);
  formData.append('category', filters.category);
  formData.append('persona', JSON.stringify(filters.persona));
  formData.append('issue_type', JSON.stringify(filters.issue_type));
  formData.append('priority', filters.priority);
  formData.append('doc_weight', filters.doc_weight.toString());

  const response = await fetch(`${API_BASE_URL}/knowledge/upload-multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.detail);
  }

  const results = await response.json();
  
  // Normalize response: return single object for single file, array for multiple
  if (files.length === 1 && Array.isArray(results) && results.length === 1) {
    return results[0];
  }
  
  return results;
}

/**
 * List all uploaded documents for a user
 */
export async function listDocuments(userId: string): Promise<Document[]> {
  const response = await apiClient.get<Document[]>(
    ENDPOINTS.KNOWLEDGE_LIST(userId)
  );
  // Map file_id to document_id for backward compatibility
  return response.map((doc) => ({
    ...doc,
    document_id: doc.file_id || doc.filename,
  }));
}

/**
 * Delete a single file and all its chunks from Elasticsearch
 * 
 * fileId format: {user_id}_{filename}_{timestamp}
 * Endpoint: /knowledge/{user_id}/file/{filename}_{timestamp}
 */
export async function deleteFile(
  fileId: string,
  userId: string
): Promise<{ file_id: string; deleted: number; status: string }> {
  // Extract filename_timestamp part (everything after user_id_)
  // fileId format: demo_user_TECH-600_App_and_Payment_Troubleshooting.md_1769847895
  // We need: TECH-600_App_and_Payment_Troubleshooting.md_1769847895
  const fileIdPart = fileId.startsWith(`${userId}_`) 
    ? fileId.substring(userId.length + 1) 
    : fileId;
  
  const response = await apiClient.delete(`/knowledge/${userId}/file/${fileIdPart}`);
  return response;
}

/**
 * Delete all files and chunks from Elasticsearch (global delete)
 */
export async function deleteAllFiles(): Promise<{
  deleted: number;
  status: string;
}> {
  const response = await apiClient.delete('/knowledge/all');
  return response;
}

/**
 * Knowledge API types
 */
export type UploadFilesFn = typeof uploadFiles;
export type ListDocumentsFn = typeof listDocuments;
