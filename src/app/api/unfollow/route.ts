// Not implemented yet

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { followerId, followingId } = req.body;

    try {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
      res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to unfollow user" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
