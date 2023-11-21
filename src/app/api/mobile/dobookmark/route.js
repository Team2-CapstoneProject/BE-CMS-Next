import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
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

    let vila = await prisma.bookmarks.findFirst({
      where: {
        vila_id: Number(vilaId),
        user_id: Number(userData.id),
      },
    });

    if ( vila ) {
      console.log("=== Undo bookmark Vila. ");
      let undoBookmark = await prisma.bookmarks.deleteMany({
        where: { 
          vila_id: Number(vilaId), 
          user_id: Number(userData.id), 
        },
      });

      if ( undoBookmark ) {
        return NextResponse.json({
            message: `Undo bookmark success`,
          }, { status: 200 }
        );
      } else {
        return NextResponse.json({
            message: `Undo bookmark failed`,
          }, { status: 400 }
        );
      }
    } else {
      console.log("=== Do bookmark Vila. ");
      let doBookmark = await prisma.bookmarks.create({
        data: {
          vila_id: Number(vilaId),
          user_id: Number(userData.id),
        },
      });

      if ( doBookmark ) {
        return NextResponse.json({
            message: `Do bookmark success`,
          }, { status: 200 }
        );
      } else {
        return NextResponse.json({
            message: `Do bookmark failed`,
          }, { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
