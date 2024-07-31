import { DUMMY_USER } from "@/lib/dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitialsFromUser } from "@/lib/utils";

type ProfileAvatarProps = {
  size?: number;
};

const DEFAULT_AVATAR_SIZE = 50;

export default function ProfileAvatar(props: ProfileAvatarProps) {
  const size = props?.size ? props.size : DEFAULT_AVATAR_SIZE;

  return (
    <Avatar>
      <AvatarImage alt={`@${DUMMY_USER.userName}`} height={size} width={size} />
      <AvatarFallback>{getInitialsFromUser(DUMMY_USER)}</AvatarFallback>
    </Avatar>
  );
}
