import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("--- Edit my password.");
  const requestHeaders = new Headers(request.headers);
  
  try {
    let email, oldpassword, newpassword;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      email = jsonData.email;
      oldpassword = jsonData.oldpassword;
      newpassword = jsonData.newpassword;

    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      email = formData.get("email");
      oldpassword = formData.get("oldpassword");
      newpassword = formData.get("newpassword");
    }

    const user = await prisma.users.findMany({
      where: { email },
    });

    const checkPass = await verifyPassword(oldpassword, user[0].password);
    console.log("Check edit password:", checkPass);

    if (checkPass) {
      if (oldpassword === newpassword) {
        return NextResponse.json({
          message: "Old and new password must differ.",
        }, { status: 404 });
      }
      if (newpassword === "" || newpassword === null) {
        return NextResponse.json({
          message: "New password cannot null.",
        }, { status: 404 });
      }

      let newPassword = await passwordHash(newpassword);

      console.log('--- new password: ', newPassword);

      const updatedUser = await prisma.users.update({
        where: { email },
        data: {
          password: newPassword,
        },
      });

      console.log('--- updated user: ', updatedUser);

      if (updatedUser) {
        return NextResponse.json({
          message: "Password updated",
        }, { status: 201 });
      } else {
        return NextResponse.json({
          message: "Update password failed",
        }, { status: 404 });
      }
    } else {
      return NextResponse.json({
        message: "Old password is false",
      }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({
      message: "All field must filled in",
    }, { status: 500 });
  }
}
