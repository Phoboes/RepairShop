import Form from "next/form";
import { Input } from "@/components/ui/input";
import { SearchButton } from "@/components/ui/SearchButton";

type Props = {
  action: string;
  placeholder: string;
};

export default function SearchForm({ action, placeholder }: Props) {
  return (
    <Form action={action} className="flex gap-2 items-center">
      <Input
        name="searchText"
        type="text"
        placeholder={placeholder}
        className="w-full"
      />
      <SearchButton />
    </Form>
  );
}
