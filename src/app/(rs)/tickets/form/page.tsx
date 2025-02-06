import { getCustomer } from "@/lib/queries/getCustomers";
import { getTicket } from "@/lib/queries/getTickets";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as KindeInit } from "@kinde/management-api-js";
import BackButton from "@/components/BackButton.js";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "./TicketForm";

// This is a Next.js page component for handling ticket forms (both creation and editing)
// Key imports for functionality:
// - Database queries (getCustomer, getTicket)
// - Authentication (Kinde)
// - Error tracking (Sentry)
// - UI components (BackButton, TicketForm)

// Returns different titles based on context:
// - New ticket form
// - New ticket for specific customer
// - Editing existing ticket
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { ticketId, customerId } = await searchParams;

  if (!customerId && !ticketId) {
    return {
      title: "New ticket form",
    };
  }

  if (customerId && !ticketId) {
    return {
      title: `New ticket for customer #${customerId}`,
    };
  }

  if (ticketId) {
    return {
      title: `Editing ticket #${ticketId}`,
    };
  }
}
// The component handles several scenarios:

// 1. Input validation
// Returns error UI if neither ticketId nor customerId provided

// 2. Permission checking
// Checks if user is a manager using Kinde authentication

// 3. New Ticket Flow (when customerId is present)
// - Validates customer exists and is active
// - For managers: fetches and provides list of all technicians
// - Renders TicketForm with appropriate props

// 4. Edit Ticket Flow (when ticketId is present)
// - Validates ticket exists
// - Fetches associated customer
// - For managers: provides full tech list and edit access
// - For regular users: only allows editing if they're the assigned technician

// Error handling
// Captures exceptions with Sentry
export default async function TicketFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { ticketId, customerId } = await searchParams;

    if (!ticketId && !customerId) {
      return (
        <>
          <h2 className="text-2xl font-bold">
            No Ticket ID or customer ID provided.
          </h2>
          <BackButton title="Go Back" variant="ghost" className="mt-4" />
        </>
      );
    }

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);

    const isManager = managerPermission?.isGranted;

    // New ticket
    if (customerId) {
      console.log("New ticket.");
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className="text-2xl font-bold">
              Customer ID #{customerId} not found.
            </h2>
            <BackButton title="Go Back" variant="ghost" className="mt-4" />
          </>
        );
      } else if (!customer.active) {
        return (
          <>
            <h2 className="text-2xl font-bold">
              Customer ID #{customerId} is not active.
            </h2>
            <BackButton title="Go Back" variant="ghost" className="mt-4" />
          </>
        );
      } else {
        // If the currently logged in user has Manager permissions, show the full technicians list so they may be assigned to the ticket.
        if (isManager) {
          KindeInit();
          const { users } = await Users.getUsers();
          const techs = users
            ? users
                .filter((user) => user.email)
                .map((user) => ({
                  id: user.email!.toLowerCase() as string,
                  description: user.email!.toLowerCase() as string,
                }))
            : [];
          // Select all users (technicians), filter them down into an array of objects for handing to the dropdown.
          return (
            <>
              <h2 className="text-2xl font-bold">
                {customer.firstName} {customer.lastName}
              </h2>
              <TicketForm
                customer={customer}
                techs={techs}
                isManager={isManager}
              />
              ;
            </>
          );
        } else {
          return (
            <>
              <h2 className="text-2xl font-bold">
                {customer.firstName} {customer.lastName}
              </h2>

              <TicketForm customer={customer} isManager={isManager} />
            </>
          );
        }
      }
    }

    // Edit ticket form
    // A user may only edit a ticket if they are an Adamin, or if they are the technician handling that ticket, however all can view.

    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        return (
          <>
            <h2 className="text-2xl font-bold">
              Ticket ID #{ticketId} not found.
            </h2>
            <BackButton title="Go Back" variant="ghost" className="mt-4" />
          </>
        );
      }

      if (ticket.customerId) {
        const customer = await getCustomer(ticket.customerId);

        if (isManager) {
          KindeInit();
          const { users } = await Users.getUsers();
          const techs = users
            ? users
                .filter((user) => user.email)
                .map((user) => ({
                  id: user.email as string,
                  description: user.email as string,
                }))
            : [];
          return (
            <>
              <h2 className="text-2xl font-bold">
                {customer.firstName} {customer.lastName}
              </h2>
              <TicketForm
                customer={customer}
                techs={techs}
                ticket={ticket}
                isManager={isManager}
              />
              ;
            </>
          );
        } else {
          const isEditable =
            ticket.tech.toLowerCase() === user!.email?.toLowerCase();
          return (
            <>
              <h2 className="text-2xl font-bold">
                {customer.firstName} {customer.lastName}
              </h2>

              <TicketForm
                customer={customer}
                ticket={ticket}
                isEditable={isEditable}
                isManager={isManager}
              />
            </>
          );
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
