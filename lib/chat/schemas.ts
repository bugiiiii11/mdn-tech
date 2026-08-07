import { z } from 'zod'

// Input contracts for the public (unauthenticated) chat surface.
//
// Everything here arrives from a browser we do not control and is written
// straight into Postgres or into a Claude prompt, so each field is bounded as
// well as type-checked -- an unbounded visitorId or sourceUrl is a cheap way
// to bloat a customer's tables.

const UUID = z.string().uuid()

export const chatbotIdSchema = UUID

// Matches the widget's generator: "v_" + base36. Kept permissive enough for
// ids already sitting in visitors' sessionStorage, strict enough that it can
// never be an injection payload or a megabyte of text.
export const visitorIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_.:-]+$/, 'visitorId contains unsupported characters')

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'message is required').max(2000),
  visitorId: visitorIdSchema,
  conversationId: UUID.optional(),
  sourceUrl: z
    .string()
    .trim()
    .max(2048)
    .url()
    .refine((u) => /^https?:$/.test(new URL(u).protocol), 'sourceUrl must be http(s)')
    .optional(),
})

export type ChatMessageInput = z.infer<typeof chatMessageSchema>

/** Flattens a ZodError into one short client-facing string. Field names are
 *  safe to echo; user input is not, so values never appear. */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'Invalid input'
  const path = issue.path.join('.')
  return path ? `${path}: ${issue.message}` : issue.message
}
