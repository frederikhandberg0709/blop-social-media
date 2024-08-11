// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/db/prisma";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]/route";

import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     const { linkedUserId } = await req.json();
//     const currentUserId = session.user.id;

//     if (!currentUserId || !linkedUserId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 },
//       );
//     }

//     if (currentUserId === linkedUserId) {
//       return NextResponse.json(
//         { error: "Cannot link account to itself" },
//         { status: 400 },
//       );
//     }

//     // Check if the link already exists
//     const existingLink = await prisma.linkedAccount.findFirst({
//       where: {
//         OR: [
//           { userId: currentUserId, linkedUserId: linkedUserId },
//           { userId: linkedUserId, linkedUserId: currentUserId },
//         ],
//       },
//     });

//     if (existingLink) {
//       return NextResponse.json(
//         { error: "Accounts are already linked" },
//         { status: 400 },
//       );
//     }

//     // Create the link
//     const linkedAccount = await prisma.linkedAccount.create({
//       data: {
//         userId: currentUserId,
//         linkedUserId: linkedUserId,
//       },
//     });

//     console.log("Linked account created:", linkedAccount);

//     return NextResponse.json(linkedAccount);
//   } catch (error) {
//     console.error("Error linking account:", error);
//     return NextResponse.json(
//       { error: "Failed to link account", details: (error as Error).message },
//       { status: 500 },
//     );
//     // console.error("Error linking account:", error);
//     // return NextResponse.json(
//     //   { error: "Failed to link account" },
//     //   { status: 500 },
//     // );
//   }
// }

export async function POST(req: NextRequest) {
  console.log("Received link account request");

  try {
    const { currentUserId, linkedUserId } = await req.json();
    console.log("Current User ID:", currentUserId);
    console.log("Linked User ID:", linkedUserId);

    if (!currentUserId || !linkedUserId) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (currentUserId === linkedUserId) {
      console.error("Attempt to link account to itself");
      return NextResponse.json(
        { error: "Cannot link account to itself" },
        { status: 400 },
      );
    }

    console.log("Verifying user existence");
    const [currentUser, linkedUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: currentUserId } }),
      prisma.user.findUnique({ where: { id: linkedUserId } }),
    ]);

    if (!currentUser || !linkedUser) {
      console.error("One or both users do not exist");
      return NextResponse.json(
        { error: "One or both users do not exist" },
        { status: 400 },
      );
    }

    console.log("Checking for existing link");
    const existingLink = await prisma.linkedAccount.findFirst({
      where: {
        OR: [
          { userId: currentUserId, linkedUserId: linkedUserId },
          { userId: linkedUserId, linkedUserId: currentUserId },
        ],
      },
    });

    if (existingLink) {
      console.log("Accounts are already linked");
      return NextResponse.json(
        { error: "Accounts are already linked" },
        { status: 400 },
      );
    }

    console.log("Creating link");
    const linkedAccount = await prisma.linkedAccount.create({
      data: {
        userId: currentUserId,
        linkedUserId: linkedUserId,
      },
    });

    console.log("Linked account created:", linkedAccount);

    return NextResponse.json(linkedAccount);
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json(
      { error: "Failed to link account", details: (error as Error).message },
      { status: 500 },
    );
  }
}
