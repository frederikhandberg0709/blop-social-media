import SendCommentClient from "./SendCommentClient";
import { notFound } from "next/navigation";

interface SendCommentPostProps {
  params: { postId: string };
}

export default async function SendComment({ params }: SendCommentPostProps) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/fetch-post/${params.postId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  const postData = await response.json();

  return <SendCommentClient post={postData} />;
}
