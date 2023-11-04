import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("=== bookmarked Vila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let vilas = await prisma.bookmarks.findMany({
      where: {
        user_id: Number(userData.id),
      },
      select: {
        id: true,
        updatedAt: true,
        Vilas: {
          select: {
            id: true,
            name: true,
            location: true,
            price: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Bookmarked Vila",
        bookmarkedVila: vilas,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
