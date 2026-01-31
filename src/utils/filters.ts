/**
 * Filter constants and types for document uploads
 */

export const CATEGORIES = [
  'policy',
  'sla',
  'sop',
  'faq',
  'templates',
  'escalation',
  'zone_rules',
] as const;

export const PERSONAS = [
  'customer_care_rep',
  'end_customer',
  'area_manager',
] as const;

export const ISSUE_TYPES = [
  // Order Issues
  'refund',
  'cancellation',
  'order_issue',
  'delay',
  'late_delivery',
  'order_status',
  'missing_item',
  'wrong_order',
  'order_modification',
  // Quality & Safety
  'quality',
  'food_safety',
  'hygiene',
  'packaging',
  // Delivery
  'delivery',
  'delivery_partner',
  'rider_issue',
  // Payment
  'payment',
  'pricing',
  // Operations
  'incident',
  'zone_issue',
  'outage',
  'systemic_problem',
  'performance',
  // Support
  'escalation',
  'compensation',
  'service_recovery',
  'response_time',
  'resolution',
  // General
  'general_inquiry',
  'account',
  'feedback',
] as const;

export const ISSUE_TYPE_GROUPS: Record<string, readonly string[]> = {
  'Order Issues': [
    'refund',
    'cancellation',
    'order_issue',
    'delay',
    'late_delivery',
    'order_status',
    'missing_item',
    'wrong_order',
    'order_modification',
  ],
  'Quality & Safety': ['quality', 'food_safety', 'hygiene', 'packaging'],
  Delivery: ['delivery', 'delivery_partner', 'rider_issue'],
  Payment: ['payment', 'pricing'],
  Operations: [
    'incident',
    'zone_issue',
    'outage',
    'systemic_problem',
    'performance',
  ],
  Support: [
    'escalation',
    'compensation',
    'service_recovery',
    'response_time',
    'resolution',
  ],
  General: ['general_inquiry', 'account', 'feedback'],
} as const;

export const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;

export const DOC_WEIGHT_MIN = 1.0;
export const DOC_WEIGHT_MAX = 3.0;
export const DOC_WEIGHT_STEP = 0.5;

export type Category = (typeof CATEGORIES)[number];
export type Persona = (typeof PERSONAS)[number];
export type IssueType = (typeof ISSUE_TYPES)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface DocumentFilters {
  category: Category;
  persona: Persona[];
  issue_type: IssueType[];
  priority: Priority;
  doc_weight: number;
}

/**
 * Format category for display (capitalize first letter, replace underscores)
 */
export function formatCategory(category: Category): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format persona for display
 */
export function formatPersona(persona: Persona): string {
  return persona
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format priority for display
 */
export function formatPriority(priority: Priority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

/**
 * Format issue type for display
 */
export function formatIssueType(issueType: IssueType): string {
  return issueType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
