import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== Do bookmark Vila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  
  const formData = await request.formData();
  let vilaId = formData.get("vilaId");

  try {
    await prisma.bookmarks.create({
      data: {
        vila_id: Number(vilaId),
        user_id: Number(userData.id),
      },
    });

    return NextResponse.json(
      {
        message: `Bookmark Vila ${vilaId} success`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
