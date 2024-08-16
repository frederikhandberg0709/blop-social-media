import { formatDate } from "@/utils/formattedDate";
import Link from "next/link";
import ProfilePicture from "../ProfilePicture";

interface QuotedPostProps {
  id: string;
  user: {
    id: string;
    username: string;
    profileName?: string;
    profilePicture?: string;
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
    <div className="mt-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center">
        <Link href={`/profile/${user.username}`} className="flex items-center">
          <ProfilePicture
            src={user.profilePicture}
            alt={`${user.profileName || user.username}'s profile picture`}
            className="h-8 w-8"
          />
          <div className="ml-2">
            <span className="font-semibold">
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
        className="mt-2 block text-sm text-blue-500 hover:underline"
      >
        Show this thread
      </Link>
    </div>
  );
}
