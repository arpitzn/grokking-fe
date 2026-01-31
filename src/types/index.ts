// Message types
export interface Message {
  message_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

// Thread/Conversation types
export interface Thread {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

// Chat API types
export interface ChatRequest {
  user_id: string;
  conversation_id?: string;
  message: string;
}

export interface ChatStreamEvent {
  content?: string;
  status?: 'completed' | 'error';
  error?: string;
  event?: 'thinking';
  phase?: ThinkingPhase;
}

// Knowledge/Document API types
export interface KnowledgeUploadRequest {
  user_id: string;
  filename: string;
  content: string;
}

export interface FileUploadResult {
  filename: string;
  file_id: string;
  chunk_count: number;
  status: 'success' | 'partial' | 'failed';
  error?: string;
}

export interface KnowledgeUploadResponse {
  file_id: string;
  chunk_count: number;
  status: 'success' | 'partial' | 'failed';
  files?: FileUploadResult[];
  error?: string;
}

export interface Document {
  document_id: string; // Keep for backward compat, map from file_id
  file_id: string;
  filename: string;
  chunk_count: number;
  created_at: string;
  // Filter fields
  category: string;
  persona: string[];
  issue_type: string[];
  priority: string;
  doc_weight: number;
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: string; message: string }>;
  timestamp: string;
}

// Thinking state types for UI
export type ThinkingPhase = 'memory' | 'planning' | 'searching' | 'generating' | null;

// Thinking trace entry - actual CoT content
export interface ThinkingEntry {
  phase: ThinkingPhase;
  content: string;
  timestamp: number;
}

// App state types
export interface AppState {
  userId: string;
  currentThreadId: string | null;
  threads: Thread[];
  messages: Message[];
  isStreaming: boolean;
  thinkingPhase: ThinkingPhase;
  thinkingEntries: ThinkingEntry[];
  streamingContent: string;
  isKnowledgePanelOpen: boolean;
  isSidebarOpen: boolean;
  documents: Document[];
  isLoadingThreads: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

// API Response types
export interface ApiError {
  detail: string;
  status_code?: number;
}
