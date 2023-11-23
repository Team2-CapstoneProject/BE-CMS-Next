import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== calculate payment.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  
  console.log("1");

  try {
    let vilaId, nNight, tglCheckin, tglCheckout;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      vilaId = jsonData.vilaId;
      nNight = jsonData.nNight;
      tglCheckin = jsonData.tglCheckin;
      tglCheckout = jsonData.tglCheckout;
    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      vilaId = formData.get("vilaId");
      nNight = formData.get("nNight");
      tglCheckin = formData.get("tglCheckin");
      tglCheckout = formData.get("tglCheckout");
    }

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
    // console.log("2");

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
    // console.log("3");

    const price = vila.price;
    const tax = price * nNight * 0.05;
    // console.log("4");

    return NextResponse.json(
      {
        vila,
        taxes: tax,
        night: price * nNight,
        total: price * nNight + tax,
        tglCheckin: tglCheckin,
        tglCheckout: tglCheckout,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
