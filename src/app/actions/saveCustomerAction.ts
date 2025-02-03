"use server"

import { eq } from 'drizzle-orm'
import {flattenValidationErrors} from 'next-safe-action'
import {redirect} from 'next/navigation'
import {actionClient} from '@/lib/safe-action'
import {db} from '@/db'
import {customers} from '@/db/schema'
import {insertCustomerSchema, type insertCustomerSchemaType} from '@/zod-schemas/customers'
import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server'

export const saveCustomerAction = actionClient
.metadata({actionName: 'saveCustomerAction'})
.schema(insertCustomerSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
}).action(async({
    parsedInput: customer,
}: { parsedInput: insertCustomerSchemaType})=> {
    const {isAuthenticated} = await getKindeServerSession()
    const isAuth = await isAuthenticated();

    // Validate the user should be using this action and if not redirect to login
    if(!isAuth){
        redirect('/login')
    }
    // New Customer
    if(customer.id === 0){
        const res = await db.insert(customers).values({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            address1: customer.address1,
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            // Optional field
            ...(customer.address2?.trim() ? {address2: customer.address2} : {}),
            ...(customer.notes?.trim() ? {notes: customer.notes} : {}),
        }).returning({
            creationId: customers.id,
        })

        return {message: `Customer id ${res[0].creationId} created successfully`}
    }

        // Existing Customer
        const res = await db.update(customers).set({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            address1: customer.address1,
            // Optional field
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            active: customer.active,
            // Optional fields
            ...(customer.address2?.trim() ? {address2: customer.address2} : {}),
            ...(customer.notes?.trim() ? {notes: customer.notes} : {}),
        }).where(eq(customers.id, customer.id!))
        .returning({
            creationId: customers.id,
        })

        return {message: `Customer id ${res[0].creationId} updated successfully`}
})