import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format a date string for display in thread list
 * Shows "Today", "Yesterday", or the full date
 */
export function formatThreadDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date string for display in messages
 * Shows time for today, "Yesterday at time" for yesterday, or full date
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a title from the first message content
 */
export function generateThreadTitle(content: string, maxLength: number = 50): string {
  // Remove newlines and extra spaces
  const cleaned = content.replace(/\s+/g, ' ').trim();
  return truncateText(cleaned, maxLength);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
