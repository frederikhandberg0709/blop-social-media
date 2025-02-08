import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getTimestamp } from "@/utils/getTimestamp";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      timestamp: getTimestamp(
        post.createdAt.toISOString(),
        post.updatedAt?.toISOString(),
      ),
      likesCount: post.likes.length,
      userLiked: false,
      user: {
        id: post.user.id,
        username: post.user.username,
        profileName: post.user.profileName,
        profilePicture: post.user.profilePicture,
        profileBanner: post.user.profileBanner,
        bio: post.user.bio,
        // followersCount: post.user.followers,
        // followingCount: post.user.followingCount,
        // postsCount: post.user.postsCount,
      },
    }));

    return NextResponse.json({ posts: formattedPosts }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
