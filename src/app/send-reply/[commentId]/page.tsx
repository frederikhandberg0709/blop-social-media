import SendReplyClient from "./SendReplyClient";

interface SendCommentPostProps {
  params: Promise<{ commentId: string }>;
}

export default async function SendReply(props: SendCommentPostProps) {
  const params = await props.params;

  return <SendReplyClient commentId={params.commentId} />;
}
