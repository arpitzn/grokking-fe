import { create } from 'zustand';
import {
  streamChat,
  getThreads,
  getMessages,
  listDocuments,
  uploadFiles,
  deleteFile,
  deleteAllFiles,
  deleteConversation,
  fetchEscalatedTickets,
  getMemories,
  deleteMemory as deleteMemoryApi,
  fetchZones,
  fetchRestaurants,
  fetchOrders,
  createOrder as createOrderApi,
  updateOrder as updateOrderApi,
} from '@/api';
import { resolveUserByPersona } from '@/api/users';
import { DEFAULT_USER_ID } from '@/utils/constants';
import type {
  Thread,
  Message,
  Document,
  ThinkingPhase,
  ThinkingEntry,
  KnowledgeUploadResponse,
  SelectedPersona,
  PersonaType,
  EndCustomerSubcategory,
  EscalatedTicket,
  Memory,
  MemoryType,
  Order,
  Zone,
  Restaurant,
  CreateOrderRequest,
  UpdateOrderRequest,
} from '@/types';
import type { DocumentFilters } from '@/utils/filters';

// Helper function to generate persona map key
const getPersonaMapKey = (
  persona: PersonaType,
  subcategory?: EndCustomerSubcategory
): string => {
  if (persona === 'end_customer' && subcategory) {
    return `end_customer:${subcategory}`; // Colon separator
  }
  return persona;
};

interface AppState {
  // User
  userId: string;
  selectedPersona: SelectedPersona;
  isResolvingUser: boolean;
  cancelChatStream: (() => void) | null;

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

  // Escalated Tickets
  escalatedTickets: EscalatedTicket[];
  escalatedTicketsCount: number;

  // Memories
  memories: Memory[];
  isLoadingMemories: boolean;
  isDeletingMemory: boolean;
  memoriesLastFetched: number | null;
  isMemoryPanelOpen: boolean;

  // Orders
  orders: Order[];
  isLoadingOrders: boolean;
  isCreatingOrder: boolean;
  isUpdatingOrder: boolean;

  // Zones & Restaurants
  zones: Zone[];
  restaurants: Restaurant[];
  isLoadingZones: boolean;
  isLoadingRestaurants: boolean;

  // Routing
  currentView: 'chat' | 'escalated-tickets' | 'orders';

  // Error state
  error: string | null;

  // Actions
  setUserId: (userId: string) => void;
  setPersona: (persona: SelectedPersona) => void;
  loadPersonaFromStorage: () => void;
  resolveUserByPersona: () => Promise<void>;
  fetchThreads: () => Promise<void>;
  selectThread: (threadId: string | null) => Promise<void>;
  createNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  toggleKnowledgePanel: () => void;
  toggleSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
  fetchDocuments: () => Promise<void>;
  uploadDocuments: (files: File[], filters: DocumentFilters) => Promise<KnowledgeUploadResponse[]>;
  deleteDocument: (fileId: string) => Promise<void>;
  deleteAllDocuments: () => Promise<void>;
  fetchEscalatedTickets: () => Promise<void>;
  fetchMemories: () => Promise<void>;
  deleteMemory: (memoryId: string, memoryType: MemoryType) => Promise<void>;
  toggleMemoryPanel: () => void;
  setCurrentView: (view: 'chat' | 'escalated-tickets' | 'orders') => void;
  deleteThread: (conversationId: string) => Promise<void>;
  clearError: () => void;
  // Orders actions
  fetchOrders: () => Promise<void>;
  createOrder: (orderData: CreateOrderRequest) => Promise<void>;
  updateOrder: (orderId: string, updates: UpdateOrderRequest) => Promise<void>;
  fetchZones: () => Promise<void>;
  fetchRestaurants: (zoneId?: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => {
  // Initialize persona from localStorage or default
  const getInitialPersona = (): SelectedPersona => {
    try {
      const stored = localStorage.getItem('selectedPersona');
      if (stored) {
        return JSON.parse(stored) as SelectedPersona;
      }
    } catch {
      // Ignore parse errors
    }
    return { persona: 'area_manager' };
  };

  return {
    // Initial state
    userId: '', // Empty until resolved - prevents calls with DEFAULT_USER_ID
    selectedPersona: getInitialPersona(),
    isResolvingUser: false,
    cancelChatStream: null,
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
    escalatedTickets: [],
    escalatedTicketsCount: 0,
    memories: [],
    isLoadingMemories: false,
    isDeletingMemory: false,
    memoriesLastFetched: null,
    isMemoryPanelOpen: false,
    orders: [],
    isLoadingOrders: false,
    isCreatingOrder: false,
    isUpdatingOrder: false,
    zones: [],
    restaurants: [],
    isLoadingZones: false,
    isLoadingRestaurants: false,
    currentView: 'chat',
    error: null,

    // Actions
    setUserId: userId => set({ userId }),

    setPersona: async (persona: SelectedPersona) => {
      const { cancelChatStream, createNewChat, resolveUserByPersona } = get();
      
      // Cancel in-flight chat streaming if any
      if (cancelChatStream) {
        cancelChatStream();
        set({ cancelChatStream: null });
      }

      // Clear current thread
      createNewChat();

      // Clear all state (threads, messages, documents, escalated tickets, memories)
      set({
        threads: [],
        messages: [],
        documents: [],
        documentsLastFetched: null,
        escalatedTickets: [],
        escalatedTicketsCount: 0,
        memories: [],
        memoriesLastFetched: null,
        isStreaming: false,
        thinkingPhase: null,
        thinkingEntries: [],
        streamingContent: '',
      });

      // Persist to localStorage
      localStorage.setItem('selectedPersona', JSON.stringify(persona));

      // Update store
      set({ selectedPersona: persona, isResolvingUser: true });

      // Resolve user by persona
      await resolveUserByPersona();
    },

    loadPersonaFromStorage: () => {
      try {
        const stored = localStorage.getItem('selectedPersona');
        if (stored) {
          const persona = JSON.parse(stored) as SelectedPersona;
          set({ selectedPersona: persona });
        } else {
          // Default to Area Manager
          set({ selectedPersona: { persona: 'area_manager' } });
        }
      } catch {
        // Default to Area Manager on error
        set({ selectedPersona: { persona: 'area_manager' } });
      }
    },

    resolveUserByPersona: async () => {
      const { selectedPersona } = get();
      set({ isResolvingUser: true, error: null });

      try {
        // Generate map key
        const mapKey = getPersonaMapKey(
          selectedPersona.persona,
          selectedPersona.subcategory
        );
        
        // Check localStorage first
        let userId: string | null = null;
        try {
          const storedMap = localStorage.getItem('persona_user_map');
          if (storedMap) {
            const personaUserMap = JSON.parse(storedMap);
            userId = personaUserMap[mapKey] || null;
          }
        } catch {
          // Ignore localStorage parse errors
        }
        
        // If no stored mapping, fetch from API
        if (!userId) {
          const response = await resolveUserByPersona(
            selectedPersona.persona,
            selectedPersona.subcategory
          );
          
          if (!response.user_id) {
            // No users found
            set({
              userId: '',
              isResolvingUser: false,
            });
            return;
          }
          
          userId = response.user_id;
          
          // Store in localStorage
          try {
            const storedMap = localStorage.getItem('persona_user_map');
            const personaUserMap = storedMap ? JSON.parse(storedMap) : {};
            personaUserMap[mapKey] = userId;
            localStorage.setItem('persona_user_map', JSON.stringify(personaUserMap));
          } catch {
            // Ignore localStorage errors
          }
        }
        
        // Update user_id in state
        set({ userId });
        
        // Validate stored user_id by attempting to fetch threads
        // If this fails, the user_id might be invalid - clear and refetch
        try {
          await get().fetchThreads();
        } catch (error) {
          // If fetchThreads fails, user_id might be invalid
          // Clear mapping and refetch
          try {
            const storedMap = localStorage.getItem('persona_user_map');
            if (storedMap) {
              const personaUserMap = JSON.parse(storedMap);
              delete personaUserMap[mapKey];
              localStorage.setItem('persona_user_map', JSON.stringify(personaUserMap));
            }
          } catch {
            // Ignore localStorage errors
          }
          
          // Refetch from API
          const response = await resolveUserByPersona(
            selectedPersona.persona,
            selectedPersona.subcategory
          );
          
          if (response.user_id) {
            userId = response.user_id;
            set({ userId });
            
            // Store new mapping
            try {
              const storedMap = localStorage.getItem('persona_user_map');
              const personaUserMap = storedMap ? JSON.parse(storedMap) : {};
              personaUserMap[mapKey] = userId;
              localStorage.setItem('persona_user_map', JSON.stringify(personaUserMap));
            } catch {
              // Ignore localStorage errors
            }
            
            // Retry fetching threads
            await get().fetchThreads();
          } else {
            set({
              userId: '',
              isResolvingUser: false,
            });
            return;
          }
        }
        
        set({ isResolvingUser: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to resolve user',
          isResolvingUser: false,
        });
      }
    },

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
        // Store cancel function for potential cancellation on persona switch
        const cancelStream = await streamChat(
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
            get().fetchThreads().then(() => {
              // If this was a new chat (no currentThreadId), find the newest conversation
              const { currentThreadId, threads } = get();
              if (!currentThreadId && threads.length > 0) {
                // Find the most recently updated conversation (first in sorted list)
                const newestThread = threads[0];
                set({ currentThreadId: newestThread.conversation_id });
              }
            });
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

        // Store cancel function for potential cancellation
        set({ cancelChatStream: cancelStream });

        // If this was a new chat, the backend created a new thread
        // We need to refresh the threads list
        if (!currentThreadId && newThreadId) {
          set({ currentThreadId: newThreadId });
        }

        // Clear cancel function on completion
        set({ cancelChatStream: null });
      } catch (error) {
        set({
          isStreaming: false,
          thinkingPhase: null,
          thinkingEntries: [],
          streamingContent: '',
          cancelChatStream: null,
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
      const { userId, selectedPersona, isResolvingUser } = get();
      
      // Don't fetch if userId is empty, default, or still resolving
      if (!userId || userId === DEFAULT_USER_ID || isResolvingUser) {
        return;
      }

      // Skip for End Customer
      if (selectedPersona.persona === 'end_customer') {
        set({ documents: [], documentsLastFetched: Date.now() });
        return;
      }

      try {
        const documents = await listDocuments(userId, selectedPersona);
        set({ documents, documentsLastFetched: Date.now() });
      } catch (error) {
        // Silent fail
        set({ documents: [], documentsLastFetched: null });
      }
    },

    fetchEscalatedTickets: async () => {
      const { userId, selectedPersona, isResolvingUser } = get();
      
      // Don't fetch if userId is empty, default, or still resolving
      if (!userId || userId === DEFAULT_USER_ID || isResolvingUser) {
        return;
      }

      // Only fetch for Area Manager and Customer Care Rep
      if (selectedPersona.persona !== 'area_manager' && selectedPersona.persona !== 'customer_care_rep') {
        set({ escalatedTickets: [], escalatedTicketsCount: 0 });
        return;
      }

      try {
        const response = await fetchEscalatedTickets(userId);
        set({ 
          escalatedTickets: response.tickets,
          escalatedTicketsCount: response.count 
        });
      } catch (error) {
        // Silent fail
        set({ escalatedTickets: [], escalatedTicketsCount: 0 });
      }
    },

    setCurrentView: (view: 'chat' | 'escalated-tickets' | 'orders') => {
      set({ currentView: view });
    },

    uploadDocuments: async (files: File[], filters: DocumentFilters) => {
      const { userId, selectedPersona } = get();
      set({ isUploadingDocument: true, error: null });

      try {
        const responses = await uploadFiles(userId, files, filters, selectedPersona);
        
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
      const { userId, selectedPersona } = get();
      set({ isDeletingDocument: true });
      try {
        await deleteFile(fileId, userId, selectedPersona.persona);
        // Refresh document list
        await get().fetchDocuments();
        set({ isDeletingDocument: false });
      } catch (err) {
        // Silent fail - no error toast
        set({ isDeletingDocument: false });
      }
    },

    deleteAllDocuments: async () => {
      const { userId, selectedPersona } = get();
      set({ isDeletingDocument: true });
      try {
        await deleteAllFiles(userId, selectedPersona.persona);
        // Refresh document list (will be empty)
        await get().fetchDocuments();
        set({ isDeletingDocument: false });
      } catch (err) {
        // Silent fail - no error toast
        set({ isDeletingDocument: false });
      }
    },

    deleteThread: async (conversationId: string) => {
      const { currentThreadId, threads } = get();

      try {
        await deleteConversation(conversationId);

        // Remove from threads list
        const updatedThreads = threads.filter(t => t.conversation_id !== conversationId);
        set({ threads: updatedThreads });

        // If deleted conversation was active, create new chat
        if (currentThreadId === conversationId) {
          get().createNewChat();
        }
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete conversation',
        });
      }
    },

    fetchMemories: async () => {
      const { userId, isResolvingUser } = get();

      // Don't fetch if userId is empty, default, or still resolving
      if (!userId || userId === DEFAULT_USER_ID || isResolvingUser) {
        return;
      }

      try {
        const memories = await getMemories(userId, 50);
        // Sort by created_at descending (newest first)
        const sortedMemories = [...memories].sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
        set({ memories: sortedMemories, memoriesLastFetched: Date.now() });
      } catch (error) {
        // Silent fail
        set({ memories: [], memoriesLastFetched: null });
      }
    },

    deleteMemory: async (memoryId: string, memoryType: MemoryType) => {
      const { memories } = get();

      // Optimistic update - remove from UI immediately
      const updatedMemories = memories.filter(m => m.memory_id !== memoryId);
      set({ memories: updatedMemories, isDeletingMemory: true });

      try {
        await deleteMemoryApi(memoryId, memoryType);
        set({ isDeletingMemory: false });
      } catch (error) {
        // Rollback on error
        set({
          memories,
          isDeletingMemory: false,
        });
      }
    },

    toggleMemoryPanel: () => {
      set(state => ({ isMemoryPanelOpen: !state.isMemoryPanelOpen }));
    },

    fetchOrders: async () => {
      const { userId, selectedPersona, isResolvingUser } = get();

      // Only fetch for End Customer
      if (selectedPersona.persona !== 'end_customer' || !userId || isResolvingUser) {
        return;
      }

      set({ isLoadingOrders: true });
      try {
        const response = await fetchOrders(userId);
        set({ orders: response.orders, isLoadingOrders: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch orders',
          isLoadingOrders: false,
        });
      }
    },

    createOrder: async (orderData: CreateOrderRequest) => {
      set({ isCreatingOrder: true });
      try {
        const newOrder = await createOrderApi(orderData);
        // Add to orders list and refresh
        const { orders } = get();
        set({
          orders: [newOrder, ...orders],
          isCreatingOrder: false,
        });
        // Refresh orders list to ensure consistency
        await get().fetchOrders();
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create order',
          isCreatingOrder: false,
        });
        throw error;
      }
    },

    updateOrder: async (orderId: string, updates: UpdateOrderRequest) => {
      set({ isUpdatingOrder: true });
      try {
        const updatedOrder = await updateOrderApi(orderId, updates);
        // Update order in list
        const { orders } = get();
        const updatedOrders = orders.map(order =>
          order.order_id === orderId ? updatedOrder : order
        );
        set({
          orders: updatedOrders,
          isUpdatingOrder: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update order',
          isUpdatingOrder: false,
        });
        throw error;
      }
    },

    fetchZones: async () => {
      const { zones, isLoadingZones } = get();
      // Don't refetch if already loaded
      if (zones.length > 0 || isLoadingZones) {
        return;
      }

      set({ isLoadingZones: true });
      try {
        const response = await fetchZones();
        set({ zones: response.zones, isLoadingZones: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch zones',
          isLoadingZones: false,
        });
      }
    },

    fetchRestaurants: async (zoneId?: string) => {
      set({ isLoadingRestaurants: true });
      try {
        const response = await fetchRestaurants(zoneId, 'active');
        set({ restaurants: response.restaurants, isLoadingRestaurants: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
          isLoadingRestaurants: false,
        });
      }
    },

    clearError: () => set({ error: null }),
  };
});

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
