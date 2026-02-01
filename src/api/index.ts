// Re-export all API functions
export { apiClient, ApiClient } from './client';
export { streamChat, type StreamChatFn } from './chat';
export {
  getThreads,
  getMessages,
  deleteConversation,
  type GetThreadsFn,
  type GetMessagesFn,
  type DeleteConversationFn,
} from './threads';
export {
  uploadFiles,
  listDocuments,
  deleteFile,
  deleteAllFiles,
  type UploadFilesFn,
  type ListDocumentsFn,
} from './knowledge';
export { resolveUserByPersona, type ResolveUserByPersonaFn } from './users';
export { fetchEscalatedTickets } from './escalatedTickets';
export {
  getMemories,
  deleteMemory,
  type GetMemoriesFn,
  type DeleteMemoryFn,
} from './memory';
export { fetchZones, type Zone, type ZonesResponse } from './zones';
export { fetchRestaurants, type Restaurant, type RestaurantsResponse } from './restaurants';
export {
  fetchOrders,
  createOrder,
  updateOrder,
  type CreateOrderRequest,
  type UpdateOrderRequest,
} from './orders';
