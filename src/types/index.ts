// Message types
export interface Message {
  message_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

// Thread/Conversation types
export interface Thread {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

// Chat API types
export interface ChatRequest {
  user_id: string;
  conversation_id?: string;
  message: string;
}

export interface ChatStreamEvent {
  content?: string;
  status?: 'completed' | 'error';
  error?: string;
  event?: 'thinking';
  phase?: ThinkingPhase;
}

// Knowledge/Document API types
export interface KnowledgeUploadRequest {
  user_id: string;
  filename: string;
  content: string;
}

export interface FileUploadResult {
  filename: string;
  file_id: string;
  chunk_count: number;
  status: 'success' | 'partial' | 'failed';
  error?: string;
}

export interface KnowledgeUploadResponse {
  file_id: string;
  chunk_count: number;
  status: 'success' | 'partial' | 'failed';
  files?: FileUploadResult[];
  error?: string;
}

export interface Document {
  document_id: string; // Keep for backward compat, map from file_id
  file_id: string;
  filename: string;
  chunk_count: number;
  created_at: string;
  // Filter fields
  category: string;
  persona: string[];
  issue_type: string[];
  priority: string;
  doc_weight: number;
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { status: string; message: string }>;
  timestamp: string;
}

// Thinking state types for UI
export type ThinkingPhase = 'memory' | 'planning' | 'searching' | 'generating' | null;

// Thinking trace entry - actual CoT content
export interface ThinkingEntry {
  phase: ThinkingPhase;
  content: string;
  timestamp: number;
}

// App state types
export interface AppState {
  userId: string;
  currentThreadId: string | null;
  threads: Thread[];
  messages: Message[];
  isStreaming: boolean;
  thinkingPhase: ThinkingPhase;
  thinkingEntries: ThinkingEntry[];
  streamingContent: string;
  isKnowledgePanelOpen: boolean;
  isSidebarOpen: boolean;
  documents: Document[];
  isLoadingThreads: boolean;
  isLoadingMessages: boolean;
  error: string | null;
}

// API Response types
export interface ApiError {
  detail: string;
  status_code?: number;
}

// Persona types
export type PersonaType = 'area_manager' | 'customer_care_rep' | 'end_customer';
export type EndCustomerSubcategory = 'platinum' | 'standard' | 'high_risk';

export interface SelectedPersona {
  persona: PersonaType;
  subcategory?: EndCustomerSubcategory; // Only for end_customer
}

// User resolution API types
export interface UserByPersonaResponse {
  user_id: string | null;
  persona: PersonaType;
  sub_category?: EndCustomerSubcategory | null;
}

// Escalated tickets types
export interface EscalatedTicket {
  ticket_id: string;
  user_id?: string | null;
  ticket_type: string;
  issue_type: string;
  subtype?: Record<string, unknown> | null;
  severity: 1 | 2;
  scope: string;
  order_id?: string | null;
  restaurant_id?: string | null;
  affected_zones: string[];
  affected_city?: string | null;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending' | 'resolved';
  created_at: string;
  updated_at: string;
  timestamp: string;
  related_orders: string[];
  related_tickets: string[];
  agent_notes: string[];
  resolution_history: Record<string, unknown>[];
  resolution?: string | null;
}

export interface EscalatedTicketsResponse {
  tickets: EscalatedTicket[];
  count: number;
  total: number;
}

// Memory types
export type MemoryType = 'mem0' | 'summary';

export interface Memory {
  memory_id: string;
  type: MemoryType;
  content: string;
  created_at: string;
  metadata?: Record<string, any>;
}

// Order types
export type OrderStatus = 'placed' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderEvent {
  timestamp: string;
  event: string;
  status: string;
}

export interface PaymentModel {
  amount: number;
  method: string;
  status: string;
}

export interface RefundModel {
  amount: number;
  status: string;
  issued_at?: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  restaurant_id: string;
  zone_id: string;
  item_name: string;
  item_quantity: number;
  item_price: number;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  payment: PaymentModel;
  refund?: RefundModel;
  refund_status?: string;
  events: OrderEvent[];
  estimated_delivery?: string;
  actual_delivery?: string;
  delivery_delay_minutes?: number;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
}

// Zone types
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

// Restaurant types
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

// Order request types
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
