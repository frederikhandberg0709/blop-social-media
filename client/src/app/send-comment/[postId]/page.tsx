import SendCommentClient from "./SendCommentClient";

interface SendCommentPostProps {
  params: Promise<{ postId: string }>;
}

export default async function SendComment(props: SendCommentPostProps) {
  const params = await props.params;
  return <SendCommentClient postId={params.postId} />;
}
