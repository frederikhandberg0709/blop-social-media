import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/db/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all bookmarks for the current user

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const userId = session.user.id;

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
        ...(type === "post" ? { postId: { not: null } } : {}),
        ...(type === "comment" ? { commentId: { not: null } } : {}),
      },
      include: {
        post: {
          include: {
            user: true,
          },
        },
        comment: {
          include: {
            user: true,
            post: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const bookmarkedItems = bookmarks
      .map((bookmark) => {
        if (bookmark.post) {
          return {
            type: "post",
            data: {
              ...bookmark.post,
              author: bookmark.post.user,
            },
            bookmarkedAt: bookmark.createdAt.toISOString(),
          };
        } else if (bookmark.comment) {
          return {
            type: "comment",
            data: {
              ...bookmark.comment,
              author: bookmark.comment.user,
              post: {
                ...bookmark.comment.post,
                user: bookmark.comment.post.user,
              },
            },
            bookmarkedAt: bookmark.createdAt.toISOString(),
          };
        }
      })
      .filter(Boolean);

    return NextResponse.json(bookmarkedItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

// Create a new bookmark for the current user

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { postId, commentId } = await request.json();

  if (!postId && !commentId) {
    return NextResponse.json(
      { error: "Either postId or commentId is required" },
      { status: 400 },
    );
  }

  try {
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        postId,
        commentId,
      },
    });
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}
