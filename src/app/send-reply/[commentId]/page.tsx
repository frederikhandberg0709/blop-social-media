import { notFound } from "next/navigation";
import SendReplyClient from "./SendReplyClient";
import { CommentProps } from "@/types/CommentProps";

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
  const commentData: CommentProps & { postId: string } = await response.json();

  if (!commentData || !commentData.postId) {
    notFound();
  }

  return <SendReplyClient comment={commentData} postId={commentData.postId} />;
}
