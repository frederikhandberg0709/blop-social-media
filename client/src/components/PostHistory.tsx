"use client";

import { useState, useEffect } from "react";

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
  const [revisions, setRevisions] = useState<PostRevision[]>([]);

  useEffect(() => {
    const fetchRevisions = async () => {
      try {
        const response = await fetch(`/api/post-revisions?postId=${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post revisions");
        }
        const data = await response.json();
        setRevisions(data);
      } catch (error) {
        console.error("Error fetching post revisions:", error);
      }
    };

    fetchRevisions();
  }, [postId]);

  return (
    <div>
      <h2 className="mb-[20px] font-bold text-white/50">Post History</h2>
      {revisions.length > 0 ? (
        <ul>
          {revisions.map((revision) => (
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
