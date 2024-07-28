"use client";

import DangerButton from "@/components/buttons/DangerButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SendComment() {
  const { data: session } = useSession();
  const router = useRouter();
  const { postId, parentId } = useParams();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/send-comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentId: parentId ?? null,
          title,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send comment");
      }

      const comment = await response.json();
      console.log("Comment created:", comment);
      router.push(`/post/${postId}`);
    } catch (error) {
      setError((error as Error).message);
      console.error("Error sending comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-[100px] mt-[90px] flex justify-center">
      <div className="flex w-[800px] flex-col gap-[30px]">
        <h1 className="text-[25px] font-semibold">Send Comment</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
          <input
            type="text"
            placeholder="Title of comment..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-300 bg-transparent p-[15px] outline-none"
          />
          <textarea
            placeholder="Write your comment here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] w-full rounded-xl border-2 border-gray-300 bg-transparent p-[15px] outline-none"
            required
          />
          <div className="flex justify-end gap-[10px]">
            <DangerButton onClick={() => router.back()} type="button">
              Cancel
            </DangerButton>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Comment"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
