"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { Button } from "@/components/ui/button";

import {
  insertTicketSchema,
  type insertTicketSchemaType,
  type selectTicketSchemaType,
} from "@/zod-schemas/tickets";

import { selectCustomerSchemaType } from "@/zod-schemas/customers";
type Props = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
  techs?: { id: string; description: string }[];
  isEditable?: boolean;
};

export default function TicketForm({
  customer,
  ticket,
  techs,
  isEditable = true,
}: Props) {
  const isManager = Array.isArray(techs) && techs.length > 0;

  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? "(New)",
    customerId: ticket?.customerId || customer.id,
    title: ticket?.title || "",
    description: ticket?.description || "",
    completed: ticket?.completed || false,
    tech: ticket?.tech ?? "new-ticket@example.com",
  };

  const form = useForm<insertTicketSchemaType>({
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  });

  console.log(ticket);

  async function submitForm(data: insertTicketSchemaType) {
    console.log(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <h2 className="text-2xl font-bold">
        {/* If there's a ticket id, determine whether the viewer is able to edit, add the appropriate heading, otherwise show the new ticket form heading. */}
        {ticket?.id
          ? isEditable
            ? "Editing Ticket #" + ticket.id
            : "Viewing Ticket #" + ticket.id
          : "New ticket form"}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col  sm:flex-row gap-4 sm:gap-8"
        >
          <div className="flex flex-col gap-2 w-full">
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle="Title"
              nameInSchema="title"
              disabled={!isEditable}
            />

            {defaultValues.tech !== "new-ticket@example.com" && (
              <CheckBoxWithLabel<insertTicketSchemaType>
                fieldTitle="Completed"
                nameInSchema="completed"
                message="Yes"
                disabled={!isEditable}
              />
            )}
            <TextAreaWithLabel<insertTicketSchemaType>
              fieldTitle="Description"
              nameInSchema="description"
              className="h-24"
              disabled={!isEditable}
            />

            {/* todo: verify this is behaving as expected. */}
            {isManager ? (
              <SelectWithLabel<insertTicketSchemaType>
                fieldTitle="Tech ID"
                nameInSchema="tech"
                data={[
                  { id: "new-ticket@example.com", description: "New Ticket" },
                  ...techs,
                ]}
              />
            ) : (
              <SelectWithLabel<insertTicketSchemaType>
                fieldTitle="Tech"
                nameInSchema="tech"
                data={[
                  { id: defaultValues.tech, description: defaultValues.tech },
                ]}
                disabled={!isEditable}
              />
            )}
            <div className="flex flex-col gap-2 w-full">
              <h3 className="text-lg font-bold">Customer info</h3>
              <hr />
              <p>
                {customer.firstName} {customer.lastName}
              </p>
              <p>
                {customer.email}, {customer.phone}
              </p>
              <p>{customer.address1}</p>
              {customer.address2 && <p>{customer.address2}</p>}
              <p>
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <hr />
            </div>
          </div>
          {isEditable && (
            <div className="flex flex-col gap-2 w-full">
              <Button
                type="submit"
                className="w-3/4"
                variant="default"
                title="Save"
              >
                Submit
              </Button>
              <Button
                type="button"
                className="w-1/4 p-4"
                variant="destructive"
                title="Reset"
                onClick={() => form.reset(defaultValues)}
              >
                Reset
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
