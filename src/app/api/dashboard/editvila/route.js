import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- edit vila.");
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
  let name = formData.get("name");
  let price = formData.get("price");
  price = Number(price);
  let description = formData.get("description");
  let location = formData.get("location");
  let latitude = formData.get("latitude");
  let longitude = formData.get("longitude");
  let images = formData.get("images");
  let facilities = formData.get("facilities");

  console.log('--- images: ', images);

  try {
    const vila = await prisma.vilas.findUnique({
      where: { id: vilaId },
    });
    const vilaImage = await prisma.vilaImages.findMany({
      where: { vila_id: vilaId },
    });
    const vilaFacility = await prisma.vilaFacilities.findMany({
      where: { vila_id: vilaId },
    });

    console.log('1');

    let i = 0;
    if (name === null || name === "" || name === undefined) {
      name = vila.name;
      i++;
    }
    if (price === null || price === 0 || price === undefined) {
      price = vila.price;
      i++;
    }
    if (
      description === null ||
      description === "" ||
      description === undefined
    ) {
      description = vila.description;
      i++;
    }
    if (location === null || location === "" || location === undefined) {
      location = vila.location;
      i++;
    }
    if (latitude === null || latitude === "" || latitude === undefined) {
      latitude = vila.latitude;
      i++;
    }
    if (longitude === null || longitude === "" || longitude === undefined) {
      longitude = vila.longitude;
      i++;
    }
    if (images === null || images === "" || images === undefined) {
      images = vilaImage.map((value) => value.slider_image);
      i++;
    } else {
      images = images
        .replace(" ", "")
        .replace("[", "")
        .replace("]", "")
        .split(",");
      await prisma.vilaImages.deleteMany({
        where: { vila_id: vilaId },
      });
      for (let image of images) {
        await prisma.vilaImages.create({
          vila_id: vilaId,
          slider_image: image,
        });
      }
    }
    console.log('2');
    if (facilities === null || facilities === "" || facilities === undefined) {
      facilities = vilaFacility.map((value) => value.facility_id);
      i++;
    } else {
      facilities = facilities
        .replace(" ", "")
        .replace("[", "")
        .replace("]", "")
        .split(",");
      await prisma.vilaFacilities.deleteMany({
        where: { vila_id: vilaId },
      });
      for (let facility of facilities) {
        await prisma.vilaFacilities.create({
          vila_id: vilaId,
          facility_id: Number(facility),
        });
      }
    }
    if (i === 8) {
      return NextResponse.json(
        {
          message: "At least one field is filled.",
        },
        { status: 404 }
      );
    }
    console.log('3');

    const newVila = await prisma.vilas.update({
      where: { id: vilaId },
      data: {
        name,
        price,
        description,
        location,
        latitude,
        longitude
      },
    });

    console.log('4');

    if (newVila) {
      return NextResponse.json(
        {
          message: "Vila updated",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json({
        message: "Update failed",
      }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
