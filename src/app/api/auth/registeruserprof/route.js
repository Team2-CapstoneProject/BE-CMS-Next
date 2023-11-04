import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- Edit my profile.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  const formData = await request.formData();
  let fullname = formData.get("fullname");
  let nickname = formData.get("nickname");
  let image = formData.get("image");
  let phone_number = formData.get("phone_number");

  try {
    const user = await prisma.users.findMany({
      where: { id: Number(userData.id) },
    });

    if (fullname === null || fullname === "") {
      fullname = user.fullname;
    }
    if (nickname === null || nickname === "") {
      nickname = user.nickname;
    }
    if (image === null || image === "") {
      image = user.image;
    }
    if (phone_number === null || phone_number === "") {
      phone_number = user.phone_number;
    }

    const newUser = await prisma.users.update({
      where: { id: Number(userData.id) },
      data: { fullname, nickname, image, phone_number },
    });

    if (newUser) {
      return NextResponse.json(
        {
          message: "Profile updated",
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Update failed",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Edit profile Error: ", error);
    return NextResponse.json(
      {
        message: "An internal server error occurred",
      },
      { status: 500 }
    );
  }
}
