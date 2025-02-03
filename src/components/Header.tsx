import { HomeIcon, File, UsersRound, LogOut } from "lucide-react";
import Link from "next/link";
import NavButton from "@/components/ui/NavButton";
import { ModeToggle } from "@/components/ModeToggle";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="animate-slide bg-background h-12 p-2 border-b sticky">
      <div className="flex h-8 items-center justify-between">
        <div className="flex items-center gap-2">
          <NavButton icon={HomeIcon} label="Home" href="/home" />
          <Link
            href="/home"
            className="flex justify-center items center gap=2 ml-0"
            title="Home"
          >
            <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
              Dan&apos;s computer repair shop
            </h1>
          </Link>
        </div>
        <div className="flex items-center">
          <NavButton icon={File} label="Tickets" href="/tickets" />

          <NavButton icon={UsersRound} label="Customers" href="/customers" />
          <ModeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon"
            title="logOut"
            aria-label="logOut"
            className="rounded-full"
          >
            <LogoutLink postLogoutRedirectURL="/login">
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
