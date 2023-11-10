import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- delete vila.");
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

  const formData = await request.formData();
  let vilaId = formData.get("vilaId");
  vilaId = Number(vilaId);

  try {
    await prisma.vilaImages.deleteMany({
      where: { vila_id: vilaId }
    });
    await prisma.vilaFacilities.deleteMany({
      where: { vila_id: vilaId }
    });
    await prisma.vilas.delete({
      where: { id: vilaId }
    });

    return NextResponse.json(
      {
        message: "successfully deleted a vila.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
