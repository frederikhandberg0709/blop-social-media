import { notFound } from "next/navigation";
import { prisma } from "@/db/prisma";
import UserProfile from "@/app/profile/[username]/UserProfile";
import { UserProps } from "@/types/components/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: {
        select: {
          followedBy: true,
          following: true,
          posts: true,
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
    followersCount: user._count.followedBy,
    followingCount: user._count.following,
    postsCount: user._count.posts,
  };

  return <UserProfile user={userProfileData} currentUserId={currentUserId} />;
}
