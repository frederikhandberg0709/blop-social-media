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
      const follow = await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
      res.status(201).json(follow);
    } catch (error) {
      res.status(500).json({ error: "Failed to follow user" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
