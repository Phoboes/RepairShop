import { db } from '@/db'
import { customers } from '@/db/schema'
import { ilike, or, sql } from 'drizzle-orm'

// or() to combine multiple search conditions - if ANY of the conditions match, the customer will be included in results
// ilike() for case-insensitive pattern matching with wildcards (%) before and after the search text

export const getCustomerSearchResults = async (searchText: string) => {
  const results = await db
    .select()
    .from(customers)
    .where(
      or(
        // Now handled by the sql below, but left here for reference
        // ilike(customers.firstName, `%${searchText}%`),
        // ilike(customers.lastName, `%${searchText}%`),
        ilike(customers.email, `%${searchText}%`),
        ilike(customers.phone, `%${searchText}%`),
        ilike(customers.city, `%${searchText}%`),
        ilike(customers.state, `%${searchText}%`),
        ilike(customers.zip, `%${searchText}%`),
        sql`lower(concat(customers.first_name, ' ', customers.last_name)) LIKE 
          ${'%' + searchText.toLowerCase().replaceAll(' ', '%') + '%'}`,
      ),
    )
  return results
}
