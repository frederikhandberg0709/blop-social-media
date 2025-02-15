import { formatDate } from "@/utils/formattedDate";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture";

interface QuotedPostProps {
  id: string;
  user: {
    id: string;
    username: string;
    profileName?: string | null;
    profilePicture?: string | null;
  };
  title?: string;
  content: string;
  createdAt: string;
}

export default function QuotedTemplate({
  id,
  user,
  title,
  content,
  createdAt,
}: QuotedPostProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 transition duration-200 hover:border-lightBorderHover dark:border-darkBorder dark:hover:border-darkBorderHover">
      <div className="flex items-center">
        <Link
          href={`/profile/${user.username}`}
          className="group flex items-center"
        >
          <ProfilePicture
            src={user.profilePicture}
            alt={`${user.profileName || user.username}'s profile picture`}
            className="h-8 w-8"
          />
          <div className="ml-2">
            <span className="font-semibold group-hover:text-blue-500">
              {user.profileName || user.username}
            </span>
            <span className="ml-2 text-sm text-gray-500">@{user.username}</span>
          </div>
        </Link>
        <span className="ml-auto text-sm text-gray-500">
          {formatDate(createdAt)}
        </span>
      </div>
      {title && <h3 className="mt-2 text-lg font-semibold">{title}</h3>}
      <p className="mt-2 text-sm">
        {content.length > 150 ? `${content.substring(0, 150)}...` : content}
      </p>
      <Link
        href={`/post/${id}`}
        className="mt-2 block text-sm font-semibold text-blue-500 hover:underline"
      >
        Show more...
      </Link>
    </div>
  );
}
