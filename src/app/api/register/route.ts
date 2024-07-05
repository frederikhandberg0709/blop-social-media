// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/db/prisma";
// import argon2 from "argon2";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { email, username, password } = req.body;

//     // Hash the password
//     const hashedPassword = await argon2.hash(password);

//     try {
//       const user = await prisma.user.create({
//         data: {
//           email,
//           username,
//           password: hashedPassword,
//         },
//       });

//       res.status(201).json(user);
//     } catch (error) {
//       res.status(500).json({ error: "User creation failed" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import { NextResponse } from "next/server";
// import { hash } from "bcrypt";
import { prisma } from "@/db/prisma";
// import { sql } from "@vercel/postgres";
import argon2 from "argon2";

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();
    // do validation here...
    // for instance, check if email is valid, password is strong enough (password critierias: min. 8 character, min. one special character, etc.), etc.
    // can use Zod library for validation

    console.log({ email, password });

    // const hashedPassword = await hash(password, 10);
    const hashedPassword = await argon2.hash(password);

    // const response =
    //   await sql`INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})`;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // res.status(201).json(user);
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
