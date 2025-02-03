import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { tickets } from '@/db/schema'
import { z } from 'zod'

export const insertTicketSchema = createInsertSchema(tickets, {
  // Controls for a ticketg that has no ID and is assigned (New) from the submission form.
  id: z.union([z.number(), z.literal('(New)')]),
  title: (schema) =>
    schema.min(1, 'Title is required').max(100, 'Title is too long.'),
  description: (schema) =>
    schema
      .min(1, 'Description is required.')
      .max(1000, 'Description is too long'),
  tech: (schema) => schema.email('Invalid email address.'),
})

export const selectTicketSchema = createSelectSchema(tickets)

export type insertTicketSchemaType = typeof insertTicketSchema._type
export type selectTicketSchemaType = typeof selectTicketSchema._type
