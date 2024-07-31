import { notFound } from "next/navigation";
import SendReplyClient from "./SendReplyClient";

interface SendCommentPostProps {
  params: { commentId: string };
}

export default async function SendReply({ params }: SendCommentPostProps) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/fetch-comment/${params.commentId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  const commentData = await response.json();

  console.log("Testing server: Comment data:", commentData);

  return <SendReplyClient comment={commentData} />;
}
