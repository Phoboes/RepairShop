import { db } from '@/db'
import { tickets, customers } from '@/db/schema'
import { eq, ilike, or, sql, asc } from 'drizzle-orm'

// or() to combine multiple search conditions - if ANY of the conditions match, the customer will be included in results
// ilike() for case-insensitive pattern matching with wildcards (%) before and after the search text

export const getTicketSearchResults = async (searchText: string) => {
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
    .where(
      or(
        ilike(tickets.title, `%${searchText}% `),
        ilike(tickets.tech, `%${searchText}% `),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.state, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
        sql`lower(concat(customers.first_name, ' ', customers.last_name)) LIKE 
          ${'%' + searchText.toLowerCase().replaceAll(' ', '%') + '%'}`,
      ),
    )
    .orderBy(asc(tickets.createdAt))

  return results
}

// Returns the Type of our query results
export type TicketSearchResultsType = Awaited<
  ReturnType<typeof getTicketSearchResults>
>
