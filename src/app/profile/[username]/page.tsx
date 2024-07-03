import { notFound } from "next/navigation";
import prisma from "@/db/prisma";
import UserProfile from "@/components/UserProfile";
import { User } from "@/types/User";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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
    },
  });

  if (!user) {
    notFound();
  }

  const userProfileData: User = {
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

  return <UserProfile user={userProfileData} currentUserId="currentUserId" />;
}
