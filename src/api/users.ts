import { apiClient } from './client';
import { ENDPOINTS } from '@/utils/constants';
import type { UserByPersonaResponse, PersonaType, EndCustomerSubcategory } from '@/types';

/**
 * Resolve persona to a random user_id from backend
 */
export async function resolveUserByPersona(
  persona: PersonaType,
  subcategory?: EndCustomerSubcategory
): Promise<UserByPersonaResponse> {
  return apiClient.post<UserByPersonaResponse>(ENDPOINTS.USERS_BY_PERSONA, {
    persona,
    sub_category: subcategory || undefined,
  });
}

/**
 * User API types
 */
export type ResolveUserByPersonaFn = typeof resolveUserByPersona;
