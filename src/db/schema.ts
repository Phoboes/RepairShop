import {
  pgTable,
  text,
  integer,
  varchar,
  boolean,
  timestamp,
  serial,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').unique().notNull(),
  phone: varchar('phone').unique().notNull(),
  address1: varchar('address1').notNull(),
  address2: varchar('address2'),
  city: varchar('city').notNull(),
  state: varchar('state', { length: 3 }).notNull(),
  zip: varchar('zip', { length: 10 }).notNull(),
  notes: text('notes'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').notNull(),
  tech: varchar('tech', { length: 20 }).notNull().default('unassigned'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const customersRelations = relations(customers, ({ many }) => ({
  tickets: many(tickets),
}))

export const ticketsRelations = relations(tickets, ({ one }) => ({
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
}))
