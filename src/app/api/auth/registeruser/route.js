import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { passwordHash, tokenSign } from "@/lib/authHelper";

export async function POST(request) {
  const requestHeaders = new Headers(request.headers);
  
  try {
    let email, password;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      email = jsonData.email;
      password = jsonData.password;

    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      email = formData.get("email");
      password = formData.get("password");
    }

    if ( email === 'admin' ) {
      return NextResponse.json(
        { message: "User: Admin cannot sign up" },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Required fields must be filled in.",
        },
        { status: 400 }
      );
    }
    let image =
      "10-Q5g-IZdM-sofWcSizh_cKC4WM_rO96";
    let fullname = email.split("@")[0];
    let nickname = fullname;
    let phone_number = "0";

    const user = await prisma.users.findMany({
      where: { email },
    });
    // console.log(user[0]);

    if (user[0]) {
      return NextResponse.json(
        {
          message:
            "Email already in use, please login or create another email.",
        },
        { status: 409 }
      );
    }

    password = await passwordHash(password);

    let newUser = await prisma.users.create({
      data: {
        google_id: '0',
        image,
        email,
        fullname,
        nickname,
        password,
        phone_number,
      },
    });
    console.log("--- newUser: ", newUser);

    const token = tokenSign({
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
    });

    return NextResponse.json(
      {
        token,
        email: newUser.email,
        fullname: newUser.fullname,
        image: newUser.image,
        nickname: newUser.nickname,
        phone_number: newUser.phone_number,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error: ", error);
    return NextResponse.json(
      {
        message: "An internal server error occurred",
      },
      { status: 500 }
    );
  }
}
