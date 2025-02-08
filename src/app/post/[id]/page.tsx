import { notFound } from "next/navigation";
import PostDetailClient from "@/components/post/PostDetailClient";
import { PostProps } from "@/types/components/post";

interface PostDetailProps {
  params: Promise<{ id: string }>;
}

const PostDetail = async (props: PostDetailProps) => {
  const params = await props.params;
  // TODO: Replace with custom hook
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/fetch-post/${params.id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    notFound();
  }

  const post = await response.json();

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

  return <PostDetailClient post={postProps} />;
};

export default PostDetail;
