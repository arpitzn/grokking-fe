import { apiClient } from './client';
import { ENDPOINTS } from '@/utils/constants';
import type { ChatRequest, ChatStreamEvent, ThinkingPhase } from '@/types';

/**
 * Stream chat response from the backend using Server-Sent Events (SSE)
 *
 * @param params - Chat request parameters
 * @param onChunk - Callback for each content chunk received
 * @param onComplete - Callback when stream is complete
 * @param onError - Callback for errors
 * @param onThinking - Callback for thinking/CoT events with phase and content
 * @returns Abort function to cancel the stream
 */
export async function streamChat(
  params: ChatRequest,
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
  onThinking?: (phase: ThinkingPhase, content: string) => void
): Promise<() => void> {
  const abortController = new AbortController();

  try {
    const response = await fetch(apiClient.buildUrl(ENDPOINTS.CHAT_STREAM), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.detail || 'Failed to start chat stream');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    // Process the stream
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            onComplete();
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines from buffer
          const lines = buffer.split('\n');
          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip empty lines
            if (!trimmedLine) continue;

            // Handle SSE data format
            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6); // Remove 'data: ' prefix

              // Check for end of stream
              if (data === '[DONE]') {
                onComplete();
                return;
              }

              try {
                const parsed: ChatStreamEvent = JSON.parse(data);

                // Handle thinking/CoT events
                if (parsed.event === 'thinking' && parsed.phase) {
                  onThinking?.(parsed.phase, parsed.content || '');
                }

                // Handle content chunks (only when not a thinking event)
                if (parsed.content && !parsed.event) {
                  onChunk(parsed.content);
                }

                // Handle completion status
                if (parsed.status === 'completed') {
                  onComplete();
                  return;
                }

                // Handle error status
                if (parsed.status === 'error' || parsed.error) {
                  throw new Error(parsed.error || 'Stream error');
                }
              } catch (parseError) {
                // If JSON parsing fails, it might be a partial chunk
                // Continue processing
                console.warn('Failed to parse SSE data:', data, parseError);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Stream was intentionally aborted
          return;
        }
        throw error;
      }
    };

    // Start processing without blocking
    processStream().catch(onError);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Stream was intentionally aborted
      return () => {};
    }
    onError(error instanceof Error ? error : new Error('Unknown error'));
  }

  // Return abort function
  return () => {
    abortController.abort();
  };
}

/**
 * Type for the stream chat function
 */
export type StreamChatFn = typeof streamChat;
