import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const getCustomer = async (id: number) => {
  const customer = await db.select().from(customers).where(eq(customers.id, id))
  //   Returns an array by default, pluck and return the first result (if any)
  return customer[0]
}
