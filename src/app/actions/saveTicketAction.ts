"use server"

import { eq } from 'drizzle-orm'
import {flattenValidationErrors} from 'next-safe-action'
import {redirect} from 'next/navigation'
import {actionClient} from '@/lib/safe-action'
import {db} from '@/db'
import {tickets} from '@/db/schema'
import {insertTicketSchema, type insertTicketSchemaType} from '@/zod-schemas/tickets'
import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'

export const saveTicketAction = actionClient
.metadata({actionName: 'saveTicketAction'})
.schema(insertTicketSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
}).action(async({
    parsedInput: ticket,
}: { parsedInput: insertTicketSchemaType})=> {
    const {isAuthenticated} = await getKindeServerSession()
    const isAuth = await isAuthenticated();

    // Validate the user should be using this action and if not redirect to login
    if(!isAuth){
        redirect('/login')
    }
    // New Ticket
    if(ticket.id === "(New)"){
        const res = await db.insert(tickets).values({
            title: ticket.title,
            description: ticket.description,
            completed: ticket.completed,
            tech: ticket.tech,
            customerId: ticket.customerId,
        }).returning({
            creationId: tickets.id,
        })

        return {message: `Ticket id ${res[0].creationId} created successfully`}
    }

        // Existing Ticket
        const res = await db.update(tickets).set({
            title: ticket.title,
            description: ticket.description,
            completed: ticket.completed,
            tech: ticket.tech,
            customerId: ticket.customerId,
        })
            
        .where(eq(tickets.id, Number(ticket.id!)))
        .returning({
            updatedId: tickets.id,
        })

        return {message: `Ticket id ${res[0].updatedId} updated successfully`}
})