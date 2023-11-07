import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createEdgeRouter } from "next-connect";
import { writeFileSync } from 'fs';

let filename = uuidv4() + "-" + new Date().getTime();
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public");
    },
    filename: (req, file, cb) =>
      cb(
        null,
        filename +
          "." +
          file.originalname.substring(
            file.originalname.lastIndexOf(".") + 1,
            file.originalname.length
          )
      ),
  }),
});

const router = createEdgeRouter();

router.use(upload.single("image")).post( async (request) => {
  const content = Date.now().toString();
  writeFileSync(`public/images/new.txt`, content);

  console.log("--- Edit my profile.");
  console.log("=== request: ", request);
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  console.log("--- header:", requestHeaders);

  let fullname, nickname, image, phone_number;

  try {
    if (requestHeaders.get("content-type").includes("json")) {
      const jsonData = await request.json();
      console.log("=== json data: ", jsonData);
      fullname = jsonData.fullname;
      nickname = jsonData.nickname;
      image = jsonData.image;
      phone_number = jsonData.phone_number;
    } else if (
      requestHeaders.get("content-type").includes("x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      console.log("=== form data: ", formData);
      fullname = formData.get("fullname");
      nickname = formData.get("nickname");
      image = formData.get("image");
      phone_number = formData.get("phone_number");
    } else if (
      requestHeaders.get("content-type").includes("form-data")
    ) {
      const formData = await request.formData();
      console.log("=== form data: ", formData);
      fullname = formData.get("fullname");
      nickname = formData.get("nickname");
      image = formData.get("image");
      phone_number = formData.get("phone_number");
    }

    console.log('--- request file: ', request.file);

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

    console.log("--- new user: ", newUser);

    if (newUser) {
      return NextResponse.json(
        {
          message: "Profile updated",
          filename: request.file.filename
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
});

export async function POST(request) {
  return router.run(request);
}

// export async function POST(request) {
//   console.log("--- Edit my profile.");
//   const requestHeaders = new Headers(request.headers);
//   const bearerHeader = requestHeaders.get("authorization");
//   const userData = verifyToken(bearerHeader);

//   console.log("--- header:", requestHeaders);

//   let fullname, nickname, image, phone_number;

//   try {
//     if (requestHeaders.get("content-type").includes("json")) {
//       const jsonData = await request.json();
//       console.log("=== json data: ", jsonData);
//       fullname = jsonData.fullname;
//       nickname = jsonData.nickname;
//       image = jsonData.image;
//       phone_number = jsonData.phone_number;
//     } else if (
//       requestHeaders.get("content-type").includes("x-www-form-urlencoded")
//     ) {
//       const formData = await request.formData();
//       console.log("=== form data: ", formData);
//       fullname = formData.get("fullname");
//       nickname = formData.get("nickname");
//       image = formData.get("image");
//       phone_number = formData.get("phone_number");
//     }

//     const user = await prisma.users.findMany({
//       where: { id: Number(userData.id) },
//     });

//     if (fullname === null || fullname === "") {
//       fullname = user.fullname;
//     }
//     if (nickname === null || nickname === "") {
//       nickname = user.nickname;
//     }
//     if (image === null || image === "") {
//       image = user.image;
//     }
//     if (phone_number === null || phone_number === "") {
//       phone_number = user.phone_number;
//     }

//     const newUser = await prisma.users.update({
//       where: { id: Number(userData.id) },
//       data: { fullname, nickname, image, phone_number },
//     });

//     console.log("--- new user: ", newUser);

//     if (newUser) {
//       return NextResponse.json(
//         {
//           message: "Profile updated",
//         },
//         { status: 201 }
//       );
//     } else {
//       return NextResponse.json(
//         {
//           message: "Update failed",
//         },
//         { status: 404 }
//       );
//     }
//   } catch (error) {
//     console.error("Edit profile Error: ", error);
//     return NextResponse.json(
//       {
//         message: "An internal server error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }
