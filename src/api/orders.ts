import { apiClient } from './client';
import type { Order, OrdersResponse } from '@/types';

export interface CreateOrderRequest {
  user_id: string;
  restaurant_id: string;
  zone_id: string;
  item_name: string;
  item_quantity: number;
  item_price: number;
  payment_method: string;
  estimated_delivery: string;
}

export interface UpdateOrderRequest {
  status?: string;
  payment?: {
    amount?: number;
    method?: string;
    status?: string;
  };
}

/**
 * Fetch orders for a user
 */
export async function fetchOrders(userId: string): Promise<OrdersResponse> {
  return apiClient.get<OrdersResponse>(`/api/orders/${userId}`);
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  return apiClient.post<Order>('/api/orders', orderData);
}

/**
 * Update an order (for inline editing)
 */
export async function updateOrder(
  orderId: string,
  updates: UpdateOrderRequest
): Promise<Order> {
  return apiClient.patch<Order>(`/api/orders/${orderId}`, updates);
}
