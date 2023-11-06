import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- Get my profile.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let fullname, nickname, email, phone_number;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      fullname = jsonData.fullname;
      nickname = jsonData.nickname;
      email = jsonData.email;
      phone_number = jsonData.phone_number;

    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      fullname = formData.get("fullname");
      nickname = formData.get("nickname");
      email = formData.get("email");
      phone_number = formData.get("phone_number");
    }

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
