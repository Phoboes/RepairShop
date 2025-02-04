"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { selectionStates } from "@/app/constants/selectionStates";
import { Button } from "@/components/ui/button";
import {
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
  insertCustomerSchema,
} from "@/zod-schemas/customers";

// Handles the submission of the form
import { useAction } from "next-safe-action/hooks";
// Custom action to save a customer
import { saveCustomerAction } from "@/app/actions/saveCustomerAction";
// Flashes a message to the user in the corner of the screen
import { useToast } from "@/hooks/use-toast";
// A widget to indicate a submission is underway
import { LoaderCircle } from "lucide-react";
// Custom component to display submission responses to the user
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";

// ? indicates that the prop is optional, if provided, it will type check against the zod schema

type Props = {
  customer?: selectCustomerSchemaType;
};

export default function CustomerForm({ customer }: Props) {
  const { getPermission, isLoading } = useKindeBrowserClient();
  const isManager = !isLoading && getPermission("manager")?.isGranted;

  const { toast } = useToast();

  // Default values are required, if no customer is povided we provide blank data to start with, or populate from the customer object provided, if provided
  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id || 0,
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address1: customer?.address1 || "",
    address2: customer?.address2 || "",
    city: customer?.city || "",
    state: customer?.state || "",
    zip: customer?.zip || "",
    notes: customer?.notes || "",
    active: customer?.active || true,
  };

  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  const {
    execute: executeSaveCustomer,
    result: saveCustomerResult,
    isPending: isSavingCustomer,
    reset: resetSaveCustomer,
  } = useAction(saveCustomerAction, {
    onSuccess: ({ data }) => {
      if (data?.message) {
        toast({
          variant: "default",
          title: "Success!",
          description: data?.message,
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Save failed. Please try again.",
      });
    },
  });

  async function submitForm(data: insertCustomerSchemaType) {
    executeSaveCustomer(data);
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8 border-2 border-green-500">
      <DisplayServerActionResponse result={saveCustomerResult} />
      <h2 className="text-2xl font-bold">
        {customer?.id ? "Edit" : "New"} customer form
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 max-w-lg border-2 border-blue-500 w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="First Name"
              nameInSchema="firstName"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Last Name"
              nameInSchema="lastName"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Email"
              nameInSchema="email"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Phone"
              nameInSchema="phone"
            />
            <TextAreaWithLabel<insertCustomerSchemaType>
              fieldTitle="Notes"
              nameInSchema="notes"
              className="h-24"
            />
            {isLoading ? (
              <p>Authenticating...</p>
            ) : isManager && customer?.id ? (
              <CheckBoxWithLabel<insertCustomerSchemaType>
                fieldTitle="Active"
                nameInSchema="active"
                message="Yes"
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Address 1"
              nameInSchema="address1"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Address 2"
              nameInSchema="address2"
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="City"
              nameInSchema="city"
            />
            <SelectWithLabel<insertCustomerSchemaType>
              fieldTitle="State"
              nameInSchema="state"
              data={selectionStates}
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle="Zip"
              nameInSchema="zip"
            />
          </div>
          <div className="flex gap-2 border-2 border-red-500">
            <Button
              type="submit"
              className="w-3/4"
              variant="default"
              title="Save"
              disabled={isSavingCustomer}
            >
              {isSavingCustomer ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              type="button"
              className="w-1/4 p-4"
              variant="destructive"
              title="Reset"
              onClick={() => {
                form.reset(defaultValues);
                resetSaveCustomer();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
