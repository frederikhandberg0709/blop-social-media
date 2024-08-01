// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/db/prisma";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const postId = searchParams.get("postId");

//   if (!postId) {
//     return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
//   }

//   try {
//     // const comments = await prisma.$queryRaw`
//     //   WITH RECURSIVE CommentTree AS (
//     //     SELECT
//     //       c."id",
//     //       c."postId",
//     //       c."parentId",
//     //       c."userId",
//     //       c."title",
//     //       c."content",
//     //       c."createdAt",
//     //       c."updatedAt",
//     //       u."username",
//     //       u."profileName",
//     //       u."profilePicture",
//     //       1 AS depth
//     //     FROM "Comment" c
//     //     JOIN "User" u ON c."userId" = u."id"
//     //     WHERE c."postId" = ${postId} AND c."parentId" IS NULL

//     //     UNION ALL

//     //     SELECT
//     //       c."id",
//     //       c."postId",
//     //       c."parentId",
//     //       c."userId",
//     //       c."title",
//     //       c."content",
//     //       c."createdAt",
//     //       c."updatedAt",
//     //       u."username",
//     //       u."profileName",
//     //       u."profilePicture",
//     //       ct."depth" + 1 AS depth
//     //     FROM "Comment" c
//     //     JOIN "User" u ON c."userId" = u."id"
//     //     JOIN CommentTree ct ON c."parentId" = ct."id"
//     //   )
//     //   SELECT * FROM CommentTree ORDER BY depth, "createdAt" DESC;
//     // `;

//     // console.log("Comments from API:", comments);

//     // // const comments = await prisma.$queryRawUnsafe(rawQuery, postId);

//     console.log("Fetching comments for postId:", postId);

//     const query = `
//       WITH RECURSIVE CommentTree AS (
//         SELECT
//           c."id",
//           c."postId",
//           c."parentId",
//           c."userId",
//           c."title",
//           c."content",
//           c."createdAt",
//           c."updatedAt",
//           u."username",
//           u."profileName",
//           u."profilePicture",
//           1 AS depth
//         FROM "Comment" c
//         JOIN "User" u ON c."userId" = u."id"
//         WHERE c."postId" = $1 AND c."parentId" IS NULL

//         UNION ALL

//         SELECT
//           c."id",
//           c."postId",
//           c."parentId",
//           c."userId",
//           c."title",
//           c."content",
//           c."createdAt",
//           c."updatedAt",
//           u."username",
//           u."profileName",
//           u."profilePicture",
//           ct."depth" + 1 AS depth
//         FROM "Comment" c
//         JOIN "User" u ON c."userId" = u."id"
//         JOIN CommentTree ct ON c."parentId" = ct."id"
//       )
//       SELECT * FROM CommentTree ORDER BY depth, "createdAt" DESC;
//     `;

//     console.log("Executing query:", query);

//     const comments = await prisma.$queryRaw(query, postId);

//     console.log("Comments from API:", comments);

//     return NextResponse.json({ comments }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching comments:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch comments" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    console.log("Fetching comments for postId:", postId);

    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: {
        user: true,
      },
    });

    console.log("Comments from API:", comments);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}
