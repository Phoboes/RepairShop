import { db } from '@/db'
import { tickets, customers } from '@/db/schema'
import { eq, ilike, or } from 'drizzle-orm'

// or() to combine multiple search conditions - if ANY of the conditions match, the customer will be included in results
// ilike() for case-insensitive pattern matching with wildcards (%) before and after the search text

export const getTicketSearchResults = async (searchText: string) => {
  const results = await db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      firstName: customers.firstName,
      lastName: customers.lastName,
      customerId: customers.id,
      ticketTitle: tickets.title,
      ticketDescription: tickets.description,
      ticketStatus: tickets.completed,
      ticketTech: tickets.tech,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      or(
        ilike(tickets.title, `%${searchText}% `),
        ilike(tickets.description, `%${searchText}% `),
        ilike(tickets.tech, `%${searchText}% `),
        ilike(customers.firstName, `%${searchText}%`),
        ilike(customers.lastName, `%${searchText}%`),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        ilike(customers.address1, `%${searchText}%`),
        ilike(customers.address2, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.state, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
      ),
    )
  return results
}
