"use client";

import { usePostRevisions } from "@/hooks/api/posts/usePostRevisions";
import { Loader2 } from "lucide-react";

interface PostRevision {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
}

interface PostHistoryProps {
  postId: string;
}

const PostHistory: React.FC<PostHistoryProps> = ({ postId }) => {
  const { data: revisions, isPending: isLoadingRevisions } = usePostRevisions({
    postId,
  });

  return (
    <div>
      <h2 className="mb-[20px] font-bold text-white/50">Post History</h2>

      {isLoadingRevisions && (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
          <p>Loading post revisions...</p>
        </div>
      )}

      {!isLoadingRevisions && revisions && revisions.length > 0 ? (
        <ul>
          {revisions.map((revision: PostRevision) => (
            <li key={revision.id} className="border-b border-gray-200 py-2">
              <h3 className="font-semibold">{revision.title}</h3>
              <p>{revision.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(revision.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="opacity-50">No revisions found.</p>
      )}
    </div>
  );
};

export default PostHistory;
