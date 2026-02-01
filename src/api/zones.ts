import { apiClient } from './client';

export interface Zone {
  zone_id: string;
  name: string;
  city: string;
  tier?: number;
  status: string;
  live_metrics?: {
    updated_at?: string;
    active_orders?: number;
    orders_last_hour?: number;
    orders_today?: number;
    avg_delivery_time?: number;
    sla_breach_rate?: number;
    riders_online?: number;
    riders_available?: number;
    riders_busy?: number;
    rider_utilization?: number;
    restaurants_active?: number;
    restaurants_paused?: number;
    avg_prep_time?: number;
    pending_complaints?: number;
    cancellation_rate?: number;
  };
  boundary?: {
    type: string;
    coordinates: number[][][];
  };
  created_at?: string;
  updated_at?: string;
}

export interface ZonesResponse {
  zones: Zone[];
  count: number;
}

/**
 * Fetch all zones
 */
export async function fetchZones(): Promise<ZonesResponse> {
  return apiClient.get<ZonesResponse>('/api/zones');
}
