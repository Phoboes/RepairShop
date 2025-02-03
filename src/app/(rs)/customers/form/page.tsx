import { getCustomer } from "@/lib/queries/getCustomers";
import BackButton from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import CustomerForm from "./CustomerForm";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams;

    if (!customerId) {
      return {
        title: "Create Customer",
      };
    } else {
      return {
        title: `Edit Customer #${customerId}`,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams;

    // Edit Customer form
    if (customerId) {
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
      }
      // console.log(customer);
      return (
        <>
          <h2 className="text-2xl font-bold">
            {customer.firstName} {customer.lastName}
          </h2>
          <CustomerForm customer={customer} />
          <BackButton title="Go Back" variant="ghost" className="mt-4" />
        </>
      );
      // Render form to edit if customer is found
      // return <CustomerForm customer={customer} />;
    } else {
      // Render form to create a new customer
      return <CustomerForm />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
