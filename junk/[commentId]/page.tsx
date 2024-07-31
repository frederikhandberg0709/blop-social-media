// // Replying to a parent comment

// import { notFound } from "next/navigation";
// import SendCommentClient from "../SendCommentClient";

// interface SendCommentReplyProps {
//   params: { commentId: string };
// }

// export default async function SendCommentReply({
//   params,
// }: SendCommentReplyProps) {
//   const response = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/fetch-comment/${params.commentId}`,
//     {
//       method: "GET",
//       cache: "no-store",
//     },
//   );

//   if (!response.ok) {
//     notFound();
//   }

//   const comment = await response.json();

//   return (
//     <>
//       <SendCommentClient post={null} comment={comment} />
//     </>
//   );
// }
