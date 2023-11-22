import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";
// import { google } from "googleapis";
// import pkey from "../../../../../second-network-403402-9612f42f626d.json";
// import stream from 'stream';
// import fs from "fs";

// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// async function authorize() {
//   const jwtClient = new google.auth.JWT(
//     pkey.client_email,
//     null,
//     pkey.private_key,
//     SCOPES
//   );
//   await jwtClient.authorize();
//   return jwtClient;
// }

// async function downloadFile(authClient, fileName, fileId) {
//   const drive = google.drive({ version: 'v3', auth: authClient });

//   if (fileName && fileId) {
//     try {
//       const file = await drive.files.get({
//         fileId: fileId,
//         alt: 'media',
//       });
//       console.log('--file:', file);
//       // console.log(file.status);
//       const b64 = Buffer.from(file.data).toString('base64');
//       const dataUrl = `data:${file.headers['content-type']};base64,${b64}`;
//       console.log('--- data url:', dataUrl);
//       return dataUrl;
//     } catch (err) {
//       // TODO(developer) - Handle error
//       console.log(err);
//       throw err;
//     }

//     // let dest = fs.createWriteStream(fileName);
//     // let progress = 0;

//     // drive.files.get(
//     //   { fileId: fileId, alt: "media" },
//     //   { responseType: "stream" },
//     //   (err, { data }) => {
//     //     if (err) {
//     //       console.log(err);
//     //       return;
//     //     }
//     //     data
//     //       .on("end", () => console.log("Done."))
//     //       .on("error", (err) => {
//     //         console.log(err);
//     //         return process.exit();
//     //       })
//     //       .on('data', d => {
//     //         progress += d.length;
//     //         if (process.stdout.isTTY) {
//     //           process.stdout.clearLine();
//     //           process.stdout.cursorTo(0);
//     //           process.stdout.write(`Downloaded ${progress} bytes`);
//     //         }   
//     //       }) 
//     //       .pipe(dest);
//     //   }
//     // );
//   }
//   else
//     console.log("Please specify file name/file id")
// }

export async function GET(request) {
  console.log("--- Get my profile.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let profile = await prisma.users.findUnique({
      where: { id: Number(userData.id) },
    });
    profile = JSON.parse(JSON.stringify(profile));

    // const profileWithoutPassword = Object.fromEntries(
    //   Object.entries(profile).filter(([key]) => !["password"].includes(key))
    // );

    // console.log('--- profile:', profileWithoutPassword);

    // imageUrl = await downloadFile(await authorize(), 'public/images/profilepict.png', profile.image);
      
    // console.log('tes');
    
    return NextResponse.json(
      {
        nickname: profile.nickname,
        fullname: profile.fullname,
        email: profile.email,
        image: 'https://drive.google.com/uc?export=view&id='+profile.image,
        number: profile.phone_number,
        // message: "My profile",
        // profile,
        // profileWithoutPassword,
        // imageUrl
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
