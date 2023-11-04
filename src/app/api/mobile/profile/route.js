import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("--- Get my profile.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let profile = await prisma.users.findUnique({
      where: { id: Number(userData.id) },
    });
    profile = JSON.parse(JSON.stringify(profile));

    const profileWithoutPassword = Object.fromEntries(
      Object.entries(profile).filter(([key]) => !["password"].includes(key))
    );

    return NextResponse.json(
      {
        message: "My profile",
        // profile,
        profileWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
