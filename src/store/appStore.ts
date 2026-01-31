import { create } from 'zustand';
import { streamChat, getThreads, getMessages, listDocuments, uploadFiles, deleteFile, deleteAllFiles } from '@/api';
import { DEFAULT_USER_ID } from '@/utils/constants';
import type {
  Thread,
  Message,
  Document,
  ThinkingPhase,
  ThinkingEntry,
  KnowledgeUploadResponse,
} from '@/types';
import type { DocumentFilters } from '@/utils/filters';

interface AppState {
  // User
  userId: string;

  // Threads
  threads: Thread[];
  currentThreadId: string | null;
  isLoadingThreads: boolean;

  // Messages
  messages: Message[];
  isLoadingMessages: boolean;

  // Streaming state
  isStreaming: boolean;
  thinkingPhase: ThinkingPhase;
  thinkingEntries: ThinkingEntry[];
  streamingContent: string;

  // UI state
  isKnowledgePanelOpen: boolean;
  isSidebarOpen: boolean;
  isMobile: boolean;

  // Documents
  documents: Document[];
  isUploadingDocument: boolean;
  isDeletingDocument: boolean;
  documentsLastFetched: number | null;

  // Error state
  error: string | null;

  // Actions
  setUserId: (userId: string) => void;
  fetchThreads: () => Promise<void>;
  selectThread: (threadId: string | null) => Promise<void>;
  createNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  toggleKnowledgePanel: () => void;
  toggleSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
  fetchDocuments: () => Promise<void>;
  uploadDocuments: (files: File[], filters: DocumentFilters) => Promise<KnowledgeUploadResponse[]>;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  userId: DEFAULT_USER_ID,
  threads: [],
  currentThreadId: null,
  isLoadingThreads: false,
  messages: [],
  isLoadingMessages: false,
  isStreaming: false,
  thinkingPhase: null,
  thinkingEntries: [],
  streamingContent: '',
  isKnowledgePanelOpen: false,
  isSidebarOpen: true,
  isMobile: false,
  documents: [],
  isUploadingDocument: false,
  isDeletingDocument: false,
  documentsLastFetched: null,
  error: null,

  // Actions
  setUserId: userId => set({ userId }),

  fetchThreads: async () => {
    const { userId } = get();
    set({ isLoadingThreads: true, error: null });

    try {
      const threads = await getThreads(userId);
      set({ threads, isLoadingThreads: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch threads',
        isLoadingThreads: false,
      });
    }
  },

  selectThread: async (threadId: string | null) => {
    set({ currentThreadId: threadId, messages: [], isLoadingMessages: true, error: null });

    if (!threadId) {
      set({ isLoadingMessages: false });
      return;
    }

    try {
      const messages = await getMessages(threadId);
      set({ messages, isLoadingMessages: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        isLoadingMessages: false,
      });
    }
  },

  createNewChat: () => {
    set({
      currentThreadId: null,
      messages: [],
      error: null,
    });
  },

  sendMessage: async (content: string) => {
    const { userId, currentThreadId, messages } = get();

    // Add user message to state immediately
    const userMessage: Message = {
      message_id: `temp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    // Add empty assistant message for streaming
    const assistantMessage: Message = {
      message_id: `temp-assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
    };

    set({
      messages: [...messages, userMessage, assistantMessage],
      isStreaming: true,
      thinkingPhase: 'memory',
      thinkingEntries: [],
      streamingContent: '',
      error: null,
    });

    let accumulatedContent = '';
    const newThreadId = currentThreadId;
    let firstChunkReceived = false;

    try {
      await streamChat(
        {
          user_id: userId,
          conversation_id: currentThreadId || undefined,
          message: content,
        },
        // onChunk callback
        chunk => {
          if (!firstChunkReceived) {
            // First chunk received - clear CoT completely
            firstChunkReceived = true;
            set({ thinkingPhase: null, thinkingEntries: [] });
          }

          accumulatedContent += chunk;

          // Update the assistant message content
          set(state => {
            const updatedMessages = [...state.messages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = accumulatedContent;
            }
            return { messages: updatedMessages, streamingContent: accumulatedContent };
          });
        },
        // onComplete callback
        () => {
          set({
            isStreaming: false,
            thinkingPhase: null,
            thinkingEntries: [],
            streamingContent: '',
          });

          // Refresh threads to get updated list
          get().fetchThreads();
        },
        // onError callback
        error => {
          set({
            isStreaming: false,
            thinkingPhase: null,
            thinkingEntries: [],
            streamingContent: '',
            error: error.message,
          });

          // Remove the empty assistant message on error
          set(state => ({
            messages: state.messages.filter(m => m.content !== ''),
          }));
        },
        // onThinking callback - accumulate CoT entries
        (phase, thinkingContent) => {
          // Only accumulate thinking entries if response hasn't started yet
          if (!firstChunkReceived) {
            set(state => ({
              thinkingPhase: phase,
              thinkingEntries: [
                ...state.thinkingEntries,
                {
                  phase,
                  content: thinkingContent,
                  timestamp: Date.now(),
                },
              ],
            }));
          }
        }
      );

      // If this was a new chat, the backend created a new thread
      // We need to refresh the threads list
      if (!currentThreadId && newThreadId) {
        set({ currentThreadId: newThreadId });
      }
    } catch (error) {
      set({
        isStreaming: false,
        thinkingPhase: null,
        thinkingEntries: [],
        streamingContent: '',
        error: error instanceof Error ? error.message : 'Failed to send message',
      });
    }
  },

  toggleKnowledgePanel: () => {
    set(state => ({ isKnowledgePanelOpen: !state.isKnowledgePanelOpen }));
  },

  toggleSidebar: () => {
    set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setIsMobile: (isMobile: boolean) => {
    set({ isMobile, isSidebarOpen: !isMobile });
  },

  fetchDocuments: async () => {
    const { userId } = get();

    try {
      const documents = await listDocuments(userId);
      set({ documents, documentsLastFetched: Date.now() });
    } catch (error) {
      // Don't show error for empty documents list
      set({ documents: [], documentsLastFetched: null });
    }
  },

  uploadDocuments: async (files: File[], filters: DocumentFilters) => {
    const { userId } = get();
    set({ isUploadingDocument: true, error: null });

    try {
      const responses = await uploadFiles(userId, files, filters);
      
      // Normalize to array for processing
      const results = Array.isArray(responses) ? responses : [responses];
      
      // Check if at least one file succeeded
      const hasSuccess = results.some(r => r.status === 'success');

      if (hasSuccess) {
        // Refresh document list immediately after upload
        await get().fetchDocuments();
      }

      set({ isUploadingDocument: false });
      return results;
    } catch (err) {
      set({
        isUploadingDocument: false,
        error: err instanceof Error ? err.message : 'Upload failed',
      });
      throw err;
    }
  },

  deleteDocument: async (fileId: string) => {
    const { userId } = get();
    set({ isDeletingDocument: true });
    try {
      await deleteFile(fileId, userId);
      // Refresh document list
      await get().fetchDocuments();
      set({ isDeletingDocument: false });
    } catch (err) {
      // Silent fail - no error toast
      set({ isDeletingDocument: false });
    }
  },

  deleteAllDocuments: async () => {
    set({ isDeletingDocument: true });
    try {
      await deleteAllFiles();
      // Refresh document list (will be empty)
      await get().fetchDocuments();
      set({ isDeletingDocument: false });
    } catch (err) {
      // Silent fail - no error toast
      set({ isDeletingDocument: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// Selector hooks for better performance
export const useUserId = () => useAppStore(state => state.userId);
export const useThreads = () => useAppStore(state => state.threads);
export const useCurrentThreadId = () => useAppStore(state => state.currentThreadId);
export const useMessages = () => useAppStore(state => state.messages);
export const useIsStreaming = () => useAppStore(state => state.isStreaming);
export const useThinkingPhase = () => useAppStore(state => state.thinkingPhase);
export const useThinkingEntries = () => useAppStore(state => state.thinkingEntries);
export const useIsKnowledgePanelOpen = () => useAppStore(state => state.isKnowledgePanelOpen);
export const useIsSidebarOpen = () => useAppStore(state => state.isSidebarOpen);
export const useDocuments = () => useAppStore(state => state.documents);
export const useError = () => useAppStore(state => state.error);
