import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== Do bookmark Vila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let vilaId;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      vilaId = jsonData.vilaId;

    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      vilaId = formData.get("vilaId");
    }

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
