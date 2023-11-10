import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- create vila.");
  const requestHeaders = new Headers(request.headers);
  console.log("--- header: ", requestHeaders);
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
  console.log('--- input data: ', formData);
  let name = formData.get("name");
  let price = formData.get("price");
  let description = formData.get("description");
  let location = formData.get("location");
  let latitude = formData.get("latitude");
  let longitude = formData.get("longitude");
  let images = formData.get("images");
  let facilities = formData.get("facilities");

  console.log('--- images: ', images);

  try {
    images = images
      .replace(" ", "")
      .replace("[", "")
      .replace("]", "")
      .replace('"', "")
      .split(",");
    facilities = facilities
      .replace(" ", "")
      .replace("[", "")
      .replace("]", "")
      .replace('"', "")
      .split(",");

    if (
      !name ||
      !price ||
      !description ||
      !location ||
      !images ||
      !facilities
    ) {
      return NextResponse.json(
        {
          message: "All required fields must be filled in.",
        },
        { status: 400 }
      );
    }
    if (latitude === null || latitude === "") {
      latitude = 0;
    }
    if (longitude === null || longitude === "") {
      longitude = 0;
    }

    let newVila = await prisma.vilas.create({
      data: {
        name,
        price: Number(price),
        description,
        location,
        latitude,
        longitude
      },
    });
    console.log('--- new vila:', newVila);

    for (let image of images) {
      await prisma.vilaImages.create({
        data: {
          vila_id: Number(newVila.id),
          slider_image: image,
        },
      });
    }
    for (let facility of facilities) {
      console.log('--- facility:', facility);
      await prisma.vilaFacilities.create({
        data: {
          vila_id: Number(newVila.id),
          facility_id: Number(facility),
        },
      });
    }

    return NextResponse.json(
      {
        message: "Create a vila is success.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({error}, { status: 500 });
  }
}
