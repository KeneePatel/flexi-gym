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
import { AuthContext } from '../../../Auth/AuthContext';
import {useContext, useEffect, useState} from "react";
import {getProfileData} from "../../../Auth/AuthService";
import {getGymInitials, getInitialsFromUser} from "@/lib/utils";


interface DecodedToken {
  firstName?: string;
  lastName?: string;
  gymName?: string;
  type?: string;
}

export function ProfileDropdown() {
  const context = useContext(AuthContext);
  const [profileData, setProfileData] = useState<DecodedToken | null>(null);
  const userProfile = getProfileData();

  useEffect(() => {

    if (userProfile) {
      try {
        // @ts-ignore
        setProfileData(userProfile);
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    }
  }, []);

  const displayFallback = profileData?.type === 'gym'
      ? getGymInitials(profileData.gymName || 'Gym')
      : getInitialsFromUser({
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || ''
      });
  const fullName = profileData?.type === 'gym' ? profileData.gymName : `${profileData?.firstName || ''} ${profileData?.lastName || ''}`;
  // @ts-ignore
  const { logout } = context;
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:ring-primary hover:ring-2"
          >
            <ProfileAvatar display={displayFallback} name={fullName} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-medium">
            {fullName}
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
            <LogoutConfirmationDialogLink/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
