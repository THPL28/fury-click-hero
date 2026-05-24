import { z } from 'zod';

// Define the Category and Severity enums
export const ViolationCategory = {
  SECURITY: 'SECURITY',
  COMPLIANCE: 'COMPLIANCE',
  CONTENT_POLICY: 'CONTENT_POLICY',
  RATE_LIMIT: 'RATE_LIMIT',
} as const;

export const ViolationSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

// Define the Webhook Violation validation schema
export const webhookViolationSchema = z.object({
  violationId: z.string().uuid({
    message: 'violationId must be a valid UUIDv4',
  }),
  category: z.nativeEnum(ViolationCategory, {
    errorMap: () => ({
      message: `category must be one of: ${Object.values(ViolationCategory).join(', ')}`,
    }),
  }),
  severity: z.nativeEnum(ViolationSeverity, {
    errorMap: () => ({
      message: `severity must be one of: ${Object.values(ViolationSeverity).join(', ')}`,
    }),
  }),
  occurredAt: z.string().datetime({
    message: 'occurredAt must be a valid ISO 8601 UTC datetime string (e.g. YYYY-MM-DDTHH:mm:ssZ)',
  }),
  reporter: z.string().min(3, {
    message: 'reporter identifier must be at least 3 characters long',
  }),
  target: z.object({
    ip: z.string().ip({ message: 'target.ip must be a valid IPv4 or IPv6 address' }).optional(),
    resourceId: z.string().min(1, { message: 'target.resourceId cannot be empty' }),
    userRef: z.string().optional(),
  }, {
    required_error: 'target object is required',
  }),
  metadata: z.record(z.any()).default({}),
});

// Infer type definitions from the Zod Schema
export type WebhookViolationInput = z.infer<typeof webhookViolationSchema>;

/**
 * Custom helper to parse and format webhook violation payloads
 * Returning rich, detailed and user-friendly error formatting
 */
export function validateWebhookViolation(payload: unknown) {
  const result = webhookViolationSchema.safeParse(payload);
  
  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        rule: err.code,
        message: err.message,
      })),
      data: null,
    };
  }

  return {
    isValid: true,
    errors: [],
    data: result.data,
  };
}
