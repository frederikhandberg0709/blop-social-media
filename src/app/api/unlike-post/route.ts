import { prisma } from "@/db/prisma";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   if (req.method === "POST") {
//     const { postId } = req.body;

//     try {
//       const like = await prisma.like.deleteMany({
//         where: {
//           postId,
//           userId: session.user.id,
//         },
//       });
//       return res.status(200).json(like);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    const unlike = await prisma.postLike.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    return NextResponse.json(unlike, { status: 201 });
  } catch (error) {
    console.error("Failed to like post: ", error);
    return NextResponse.json(
      { error: "Failed to like post", details: error },
      { status: 500 },
    );
  }
}
