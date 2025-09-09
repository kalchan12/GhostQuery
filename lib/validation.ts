import { z } from 'zod';
import DOMPurify from 'dompurify';

// Schema for search request validation
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(500, 'Search query too long')
    .regex(/^[a-zA-Z0-9\s\-_.!?]+$/, 'Invalid characters in search query'),
  limit: z.number().min(1).max(50).optional().default(10),
});

export type SearchRequest = z.infer<typeof searchSchema>;

// Sanitize user input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  // For server-side, we'll create a mock DOM environment
  if (typeof window === 'undefined') {
    // Simple server-side sanitization as fallback
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 500); // Limit length
  }
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

// Rate limiting store (in-memory for simplicity)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string, maxRequests = 100, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes
