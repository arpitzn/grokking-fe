// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Default user ID for demo purposes
export const DEFAULT_USER_ID = import.meta.env.VITE_USER_ID || 'demo_user';

// Thinking phases configuration
export const THINKING_PHASES = [
  { id: 'understanding', text: 'Understanding your question...', minDuration: 800 },
  { id: 'searching', text: 'Searching knowledge base...', minDuration: 1500 },
  { id: 'generating', text: 'Generating response...', minDuration: 1000 },
] as const;

// API Endpoints
export const ENDPOINTS = {
  CHAT_STREAM: '/chat/stream',
  THREADS: (userId: string) => `/threads/${userId}`,
  MESSAGES: (conversationId: string) => `/threads/${conversationId}/messages`,
  KNOWLEDGE_UPLOAD: '/knowledge/upload-multiple',
  KNOWLEDGE_LIST: (userId: string) => `/knowledge/${userId}`,
  KNOWLEDGE_DELETE_FILE: (fileId: string) => `/knowledge/file/${fileId}`,
  KNOWLEDGE_DELETE_ALL: '/knowledge/all',
  HEALTH: '/health',
  USERS_BY_PERSONA: '/users/by-persona',
  MEMORY_LIST: (userId: string) => `/memory/${userId}`,
  MEMORY_DELETE: (memoryId: string) => `/memory/${memoryId}`,
} as const;

// Message count for summarization trigger (matches backend)
export const SUMMARIZATION_TRIGGER_COUNT = 10;

// Default pagination
export const DEFAULT_MESSAGE_LIMIT = 50;
export const DEFAULT_MESSAGE_OFFSET = 0;
