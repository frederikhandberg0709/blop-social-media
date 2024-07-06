import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { followerId, followingId } = req.query;

    try {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: followerId as string,
            followingId: followingId as string,
          },
        },
      });

      res.status(200).json({ isFollowing: !!follow });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch follow status" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
