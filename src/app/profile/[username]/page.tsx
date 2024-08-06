import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import UserProfile from "@/components/UserProfile";
import { UserProps } from "@/types/UserProps";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PostProps } from "@/types/PostProps";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
      posts: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const userProfileData: UserProps = {
    id: user.id,
    username: user.username,
    profileName: user.profileName ?? "",
    profilePicture: user.profilePicture ?? "",
    profileBanner: user.profileBanner ?? "",
    bio: user.bio ?? "",
    followersCount: user._count.followers,
    followingCount: user._count.following,
    postsCount: user._count.posts,
  };

  const userPosts: PostProps[] = user.posts.map((post) => ({
    id: post.id,
    user: {
      id: post.user.id,
      username: post.user.username,
      profileName: post.user.profileName ?? "",
      profilePicture: post.user.profilePicture ?? "",
    },
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    title: post.title ?? "",
    content: post.content,
    // initialLikesCount: post._count?.likes ?? 0,
    userLiked: false, // You might need to fetch this separately
  }));

  return (
    <UserProfile
      user={userProfileData}
      posts={userPosts}
      currentUserId={currentUserId}
    />
  );
}
