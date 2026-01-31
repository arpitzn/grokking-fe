import { apiClient } from './client';
import { ENDPOINTS, DEFAULT_MESSAGE_LIMIT, DEFAULT_MESSAGE_OFFSET } from '@/utils/constants';
import type { Thread, Message } from '@/types';

/**
 * Fetch all threads/conversations for a user
 */
export async function getThreads(userId: string): Promise<Thread[]> {
  return apiClient.get<Thread[]>(ENDPOINTS.THREADS(userId));
}

/**
 * Fetch messages for a specific conversation
 */
export async function getMessages(
  conversationId: string,
  limit: number = DEFAULT_MESSAGE_LIMIT,
  offset: number = DEFAULT_MESSAGE_OFFSET
): Promise<Message[]> {
  return apiClient.get<Message[]>(ENDPOINTS.MESSAGES(conversationId), {
    limit,
    offset,
  });
}

/**
 * Thread API types
 */
export type GetThreadsFn = typeof getThreads;
export type GetMessagesFn = typeof getMessages;
