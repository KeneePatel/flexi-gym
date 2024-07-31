import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INITIAL_LINKS } from "@/lib/constants";
import Logo from "../logo/logo";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";
import { ThemeToggler } from "../theme-toggler";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b">
      <div className="flex items-center gap-2">
        <Link href="/" prefetch={false}>
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center text-sm font-medium">
          {INITIAL_LINKS.map((link, index) => {
            return (
              <Link key={index} href={link.ref} prefetch={false}>
                <Button variant="link" className="px-2">
                  {link.name}
                </Button>
              </Link>
            );
          })}
        </nav>
        <form className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for gyms..."
              className="pl-10 w-full bg-primary-foreground/90 border-0 focus:ring-0"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <ProfileDropdown />
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
