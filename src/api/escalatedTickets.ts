import { apiClient } from './client';
import type { EscalatedTicketsResponse } from '@/types';

/**
 * Fetch escalated tickets for a user
 * Returns tickets with ticket_type="complaint" and severity IN [1, 2]
 */
export async function fetchEscalatedTickets(
  userId: string
): Promise<EscalatedTicketsResponse> {
  return apiClient.get<EscalatedTicketsResponse>(`/api/escalated-tickets/${userId}`);
}
