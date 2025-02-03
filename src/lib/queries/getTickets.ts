import { db } from '@/db'
import { tickets } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const getTicket = async (id: number) => {
  const ticket = await db.select().from(tickets).where(eq(tickets.id, id))
  //   Returns an array by default, pluck and return the first result (if any)
  return ticket[0]
}
