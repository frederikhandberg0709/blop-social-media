import { notFound } from "next/navigation";
import prisma from "@/db/prisma";
import Post from "@/components/post/PostTemplate";

interface PostDetailProps {
  params: { id: string };
}

const PostDetail = async ({ params }: PostDetailProps) => {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      user: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="flex justify-center mt-[90px] mb-[100px]">
      <div className="flex flex-col gap-[30px] w-[800px]">
        <h1 className="text-[25px] font-semibold">Post Detail</h1>
        <Post
          profilePicture={post.user.profilePicture}
          profileName={post.user.profileName}
          username={post.user.username}
          timestamp={new Date(post.createdAt).toLocaleString()}
          textContent={post.content}
        />
      </div>
    </div>
  );
};

export default PostDetail;
