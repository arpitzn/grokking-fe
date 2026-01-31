// Re-export all API functions
export { apiClient, ApiClient } from './client';
export { streamChat, type StreamChatFn } from './chat';
export { getThreads, getMessages, type GetThreadsFn, type GetMessagesFn } from './threads';
export {
  uploadFiles,
  listDocuments,
  deleteFile,
  deleteAllFiles,
  type UploadFilesFn,
  type ListDocumentsFn,
} from './knowledge';
