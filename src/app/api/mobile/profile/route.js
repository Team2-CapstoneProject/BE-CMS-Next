import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import pkey from "../../../../../second-network-403402-9612f42f626d.json";
import stream from 'stream';

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
//     let dest = createWriteStream(fileName);
//     drive.files.get(
//       { fileId: fileId, alt: "media" },
//       { responseType: "stream" },
//       (err, { data }) => {
//         if (err) {
//           console.log(err);
//           return;
//         }
//         data
//           .on("end", () => console.log("Done."))
//           .on("error", (err) => {
//             console.log(err);
//             return process.exit();
//           })
//           .pipe(dest);
//       }
//     );
//   }
//   else
//     console.log("Please specify file name/file id")
// }

// async function downloadFile(realFileId) {
//   // Get credentials and build service
//   // TODO (developer) - Use appropriate auth mechanism for your app

//   const {GoogleAuth} = require('google-auth-library');
//   const {google} = require('googleapis');

//   const auth = new GoogleAuth({
//     scopes: 'https://www.googleapis.com/auth/drive',
//   });
//   const service = google.drive({version: 'v3', auth});

//   fileId = realFileId;
//   try {
//     const file = await service.files.get({
//       fileId: fileId,
//       alt: 'media',
//     });
//     console.log(file.status);
//     return file.status;
//   } catch (err) {
//     // TODO(developer) - Handle error
//     throw err;
//   }
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

    const profileWithoutPassword = Object.fromEntries(
      Object.entries(profile).filter(([key]) => !["password"].includes(key))
    );

    // imageUrl = await uploadFile(await authorize(), filename, buffer);

    return NextResponse.json(
      {
        message: "My profile",
        // profile,
        profileWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
