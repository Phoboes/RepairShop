import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <main className="flex flex-col items-center h-screen">
      <h2 className="text-2xl font-bold py-4">Login</h2>
      <Button asChild>
        <LoginLink>Sign in</LoginLink>
      </Button>
    </main>
  );
}
