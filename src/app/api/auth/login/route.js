import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyPassword, tokenSign } from "@/lib/authHelper";

export async function POST(request) {
  try {
    const requestHeaders = new Headers(request.headers);
    console.log("header:", requestHeaders);
    let loginType, email, password;

    if ( requestHeaders.get('content-type') === 'application/json' ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      loginType = jsonData.loginType;
      email = jsonData.email;
      password = jsonData.password;

    } else if ( requestHeaders.get('content-type') === 'application/x-www-form-urlencoded' ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      loginType = formData.get("loginType");
      email = formData.get("email");
      password = formData.get("password");
    }

    

    if (loginType === "admin") {
      console.log("--- admin.");
      if (email === "admin" && password === "admin") {
        const token = tokenSign({ email });

        return NextResponse.json(
          { message: "Admin: Login success", token },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Admin: Username or password is false" },
          { status: 400 }
        );
      }
    } else {
      console.log("--- user.");

      if ( email === 'admin' ) {
        return NextResponse.json(
          { message: "User: User cannot login as admin" },
          { status: 400 }
        );
      }

      const user = await prisma.users.findMany({
        where: { email },
      });

      if (user[0]) {
        const checkPass = await verifyPassword(password, user[0].password);

        if (checkPass) {
          const token = tokenSign({
            id: user[0].id,
            email: user[0].email,
            nickname: user[0].nickname,
          });

          return NextResponse.json(
            {
              message: "User: Login success",
              token,
              email: user[0].email,
              fullname: user[0].fullname,
              image: user[0].image,
              nickname: user[0].nickname,
              phone_number: user[0].phone_number,
            },
            { status: 201 }
          );
        } else {
          return NextResponse.json(
            { message: "User: Username or password is false" },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "User: Email is not found. Please create one." },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error(`Login Error: `, error);
    return NextResponse.json(
      {
        message: "An internal server error occurred",
      },
      { status: 500 }
    );
  }
}
