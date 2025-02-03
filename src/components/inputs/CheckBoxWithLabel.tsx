"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  message?: string;
  disabled?: boolean;
};

export function CheckBoxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  message,
  disabled = false,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="w-full flex flex-row gap-2">
          <FormLabel className={"text-base w-1/3 mt-2"} htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                id={nameInSchema}
                {...field}
                onCheckedChange={field.onChange}
                checked={field.value}
                disabled={disabled}
              />
            </FormControl>
            {message}
          </div>
          <FormMessage />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
