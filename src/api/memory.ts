import { apiClient } from './client';
import { ENDPOINTS } from '@/utils/constants';
import type { Memory, MemoryType } from '@/types';

/**
 * Get all memories for a user
 */
export async function getMemories(userId: string, limit: number = 50): Promise<Memory[]> {
  const response = await apiClient.get<Memory[]>(
    ENDPOINTS.MEMORY_LIST(userId),
    { limit }
  );
  return response;
}

/**
 * Delete a memory
 */
export async function deleteMemory(
  memoryId: string,
  memoryType: MemoryType
): Promise<{ status: string; memory_id: string }> {
  const response = await apiClient.delete<{ status: string; memory_id: string }>(
    `${ENDPOINTS.MEMORY_DELETE(memoryId)}?memory_type=${memoryType}`
  );
  return response;
}

/**
 * Memory API types
 */
export type GetMemoriesFn = typeof getMemories;
export type DeleteMemoryFn = typeof deleteMemory;
