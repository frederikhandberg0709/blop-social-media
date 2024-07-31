// // Commenting on a post

// import { PostProps } from "@/types/PostProps";
// import { notFound } from "next/navigation";
// import SendCommentClient from "../SendCommentClient";

// interface SendCommentPostProps {
//   params: { postId: string };
// }

// export default async function SendCommentPost({
//   params,
// }: SendCommentPostProps) {
//   const response = await fetch(
//     `${process.env.NEXTAUTH_URL}/api/fetch-post/${params.postId}`,
//     {
//       method: "GET",
//       cache: "no-store",
//     },
//   );

//   if (!response.ok) {
//     notFound();
//   }

//   const post = await response.json();

//   return (
//     <>
//       <SendCommentClient post={post} comment={null} />
//     </>
//   );
// }
