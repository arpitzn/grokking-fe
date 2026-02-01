import { apiClient } from './client';

export interface Restaurant {
  restaurant_id: string;
  name: string;
  type: string;
  cuisines: string[];
  location: {
    address?: string;
    city?: string;
    zone_id: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  is_open: boolean;
  is_paused: boolean;
  status: string;
  current_metrics?: {
    updated_at?: string;
    avg_prep_time_minutes?: number;
    on_time_rate?: number;
    quality_rating?: number;
    support_ticket_count?: number;
    order_volume?: number;
    current_wait_time?: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  count: number;
}

/**
 * Fetch restaurants with optional filtering by zone_id and status
 */
export async function fetchRestaurants(
  zoneId?: string,
  status: string = 'active'
): Promise<RestaurantsResponse> {
  const params = new URLSearchParams();
  if (zoneId) {
    params.append('zone_id', zoneId);
  }
  if (status) {
    params.append('status', status);
  }
  
  const queryString = params.toString();
  const url = `/api/restaurants${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<RestaurantsResponse>(url);
}
