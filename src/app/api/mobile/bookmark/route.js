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
            VilaImages: {
              select: {
                slider_image: true,
              },
              orderBy: {
                id: "asc",
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    vilas = vilas.map((x) => {
      return {
        id: x.id,
        updatedAt: x.updatedAt,
        vila_id: x.Vilas.id,
        vila_name: x.Vilas.name,
        vila_location: x.Vilas.location,
        vila_price: x.Vilas.price,
        vila_image: x.Vilas.VilaImages.length > 0 ? x.Vilas.VilaImages[0].slider_image : null,
      }
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
