import { PostProps } from "@/types/PostProps";
import { notFound } from "next/navigation";
import SendCommentClient from "./SendCommentClient";

interface SendCommentProps {
  params: { postId: string; parentCommentId?: string };
}

export default async function SendComment({ params }: SendCommentProps) {
  const postId = params.postId;
  const parentCommentId = params.parentCommentId;

  //   const response = await fetch(
  //     `${process.env.NEXTAUTH_URL}/api/fetch-post/${params.postId}`,
  //     { method: "GET", cache: "no-store" },
  //   );

  const fetchPost = async () => {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/fetch-post/${postId}`,
      { method: "GET", cache: "no-store" },
    );

    if (!response.ok) {
      notFound();
    }

    return response.json();
  };

  const fetchParentComment = async () => {
    if (!parentCommentId) return null;

    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/fetch-comment/${parentCommentId}`,
      { method: "GET", cache: "no-store" },
    );

    if (!response.ok) {
      notFound();
    }

    return response.json();
  };

  const [post, parentComment] = await Promise.all([
    fetchPost(),
    fetchParentComment(),
  ]);

  //   if (!response.ok) {
  //     notFound();
  //   }

  //   const post = await response.json();

  const postProps: PostProps = {
    id: post.id,
    title: post.title,
    content: post.content,
    timestamp: post.timestamp,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    initialLikesCount: post.likesCount,
    userLiked: post.userLiked,
    user: {
      id: post.user.id,
      username: post.user.username,
      profileName: post.user.profileName,
      profilePicture: post.user.profilePicture,
      profileBanner: post.user.profileBanner,
      bio: post.user.bio,
      followersCount: post.user.followersCount,
      followingCount: post.user.followingCount,
      postsCount: post.user.postsCount,
    },
    imageContent: post.imageContent,
    videoContent: post.videoContent,
  };

  return (
    <>
      <SendCommentClient post={postProps} parentCom />
    </>
  );
}
