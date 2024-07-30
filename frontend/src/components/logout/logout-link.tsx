import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export default function LogoutLink() {
  return (
    <Link href="#" className="flex items-center gap-2" prefetch={false}>
      <LogOutIcon className="w-4 h-4" />
      Logout
    </Link>
  );
}
