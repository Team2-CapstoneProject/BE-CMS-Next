import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("=== calculate payment.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  const vilaId = request.nextUrl.searchParams.get("vila_id");
  const nNight = request.nextUrl.searchParams.get("n_night");
  console.log("1");

  try {
    const vila = await prisma.vilas.findUnique({
      where: { id: Number(vilaId) },
      select: {
        id: true,
        name: true,
        price: true,
        location: true,
        VilaImages: {
          take: 1,
          select: {
            id: true,
            slider_image: true,
          },
          orderBy: {
            id: 'asc',
          },
        }
      },
    });
    console.log("2");

    if (!vila) {
      return NextResponse.json(
        {
          message: "Vila id is not found.",
        },
        {
          status: 404,
        }
      );
    }
    console.log("3");

    const price = vila.price;
    const tax = price * nNight * 0.05;
    console.log("4");

    return NextResponse.json(
      {
        vila,
        taxes: tax,
        night: price * nNight,
        total: price * nNight + tax,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
