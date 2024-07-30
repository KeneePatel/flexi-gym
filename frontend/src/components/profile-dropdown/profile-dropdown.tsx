import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CalendarIcon, CreditCardIcon, UserIcon } from "lucide-react";
import ProfileAvatar from "./profile-avatar";
import { LogoutConfirmationDialogLink } from "../logout/logout-confirmation-dialog-link";

export function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:ring-primary hover:ring-2"
        >
          <ProfileAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-medium">
          Kenee Patel
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href="/profile"
            className="flex items-center gap-2"
            prefetch={false}
          >
            <UserIcon className="w-4 h-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <CalendarIcon className="w-4 h-4" />
            Past Bookings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <CreditCardIcon className="w-4 h-4" />
            Payment History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutConfirmationDialogLink />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
