import { notFound } from "next/navigation";
import PostDetailClient from "@/components/post/PostDetailClient";

interface PostDetailProps {
  params: { id: string };
}

const PostDetail = async ({ params }: PostDetailProps) => {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/fetch-post/${params.id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const post = await response.json();

  const postProps = {
    id: post.id,
    profilePicture: post.user.profilePicture,
    profileName: post.user.profileName,
    username: post.user.username,
    timestamp: new Date(post.createdAt).toLocaleString(),
    title: post.title,
    textContent: post.content,
    likesCount: post.likes,
  };

  return <PostDetailClient post={postProps} />;
};

export default PostDetail;
