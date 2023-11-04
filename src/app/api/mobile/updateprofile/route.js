import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- Get my profile.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  const formData = await request.formData();
  let fullname = formData.get("fullname");
  let nickname = formData.get("nickname");
  let email = formData.get("email");
  let phone_number = formData.get("phone_number");

  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(userData.id) },
    });

    let i = 0;
    if (fullname === null || fullname === "") {
      fullname = user.fullname;
      i++;
    }
    if (nickname === null || nickname === "") {
      nickname = user.nickname;
      i++;
    }
    if (email === null || email === "") {
      email = user.email;
      i++;
    }
    if (phone_number === null || phone_number === "") {
      phone_number = user.phone_number;
      i++;
    }
    if (i === 4) {
      return NextResponse.json({
        message: "At least one field is filled.",
      }, { status: 404 });
    }

    const newUser = await prisma.users.update({
      where: { id: Number(userData.id) },
      data: { fullname, nickname, email, phone_number },
    });

    if (newUser) {
      return NextResponse.json({
        message: "Profile updated",
      }, { status: 201 });
    } else {
      return NextResponse.json({
        message: "Update failed",
      }, { status: 404 });
    }
  } catch (error) {
    console.error("Edit profile Error: ", error);
    return NextResponse.json({
      message: "An internal server error occurred",
    }, { status: 500 });
  }
}
