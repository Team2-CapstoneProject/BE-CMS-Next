import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  console.log("=== detailed vila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  const id = Number(params.id);

  try {
    const vila = await prisma.vilas.findMany({
      where: { id: Number(id) },
      include: {
        VilaImages: {
          select: {
            id: true,
            slider_image: true,
            updatedAt: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        Transactions: {
          select: {
            id: true,
            Users: {
              select: {
                id: true,
                image: true,
                fullname: true,
              },
            },
            Reviews: {
              select: {
                id: true,
                score: true,
                description: true,
                updatedAt: true,
              },
            },
          },
        },
        VilaFacilities: {
          select: {
            id: true,
            Facilities: {
              select: {
                label: true,
                icon: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: `Vila id: ${id}`,
      vila,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
