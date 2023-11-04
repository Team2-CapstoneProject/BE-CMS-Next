import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("--- list vila dashboard.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  if (userData.email !== "admin") {
    return NextResponse.json(
      {
        message: "You must login as admin.",
      },
      { status: 500 }
    );
  }

  try {
    let vilas = await prisma.vilas.findMany({
      include: {
        VilaImages: true,
        VilaFacilities: {
          select: {
            id: true,
            Facilities: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "List of All Vilas",
        vilas,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
