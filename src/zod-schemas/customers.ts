import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { customers } from '@/db/schema'

export const insertCustomerSchema = createInsertSchema(customers, {
  firstName: (schema) =>
    schema.min(1, 'First name is required').max(32, 'First name is too long'),
  lastName: (schema) =>
    schema.min(1, 'Last name is required').max(32, 'Last name is too long'),
  email: (schema) => schema.email('Invalid email address'),
  phone: (schema) =>
    schema
      .min(10, 'Phone number is too short')
      .max(15, 'Phone number is too long'),
  address1: (schema) =>
    schema.min(10, 'Address is too short').max(100, 'Address is too long'),
  city: (schema) => schema.min(2).max(32),
  state: (schema) => schema.min(2).max(32),
  zip: (schema) =>
    schema.min(2, 'Zip code is too short').max(10, 'Zip code is too long'),
})

export const selectCustomerSchema = createSelectSchema(customers)

export type insertCustomerSchemaType = typeof insertCustomerSchema._type
export type selectCustomerSchemaType = typeof selectCustomerSchema._type
