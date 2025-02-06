import { db } from '@/db'
import { tickets, customers } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

// or() to combine multiple search conditions - if ANY of the conditions match, the customer will be included in results
// ilike() for case-insensitive pattern matching with wildcards (%) before and after the search text

export const getOpenTickets = async () => {
  const results = await db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      phone: customers.phone,
      address1: customers.address1,
      city: customers.city,
      state: customers.state,
      zip: customers.zip,
      customerId: customers.id,
      ticketTitle: tickets.title,
      ticketDescription: tickets.description,
      ticketStatus: tickets.completed,
      ticketTech: tickets.tech,
      completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false))
    .orderBy(asc(tickets.createdAt))
  return results
}

// Returns the Type of our query results
export type TicketSearchResults = Awaited<ReturnType<typeof getOpenTickets>>
