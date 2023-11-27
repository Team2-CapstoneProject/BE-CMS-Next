import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("=== allVila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const oldUserData = verifyToken(bearerHeader);
  // console.log('1');

  try {
    const userData = await prisma.users.findUnique({
      where: {
        id: Number(oldUserData.id)
      }
    });
    // console.log('2');

    let vilas = await prisma.vilas.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        location: true,
        updatedAt: true,
        VilaImages: {
          select: {
            id: true,
            slider_image: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        Transactions: {
          select: {
            id: true,
            createdAt: true,
            Reviews: {
              select: {
                id: true,
                score: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        Bookmarks: {
          select: {
            id: true,
            user_id: true,
          },
        },
      },
    });
    // console.log('3');

    vilas = JSON.parse(JSON.stringify(vilas));
    // console.log('4');

    for (let vila of vilas) {
      let skors = vila.Transactions.filter((value) => {
        if (value.Reviews.length !== 0) {
          return true;
        } else {
          return false;
        }
      });
      // console.log('5 vilaid:', vila.id);

      if (vila.VilaImages.length !== 0) {
        vila.VilaImages = vila.VilaImages[0];
      }
      // console.log('5.1');

      vila.isBookmarked = false;

      for (let bookmark of vila.Bookmarks) {
        if (bookmark.user_id == userData.id) {
          vila.isBookmarked = true;
          break;
        }
      }

      vila.jumlahBookmark = vila.Bookmarks.length;
      vila.jumlahTransaction = vila.Transactions.length;
      vila.nReview = skors.length;
      // console.log('5.2');

      if (vila.nReview === 1) {
        // console.log('5.2.1');
        vila.score = skors[0].Reviews[0].score;
      } else if (vila.nReview === 0) {
        // console.log('5.2.2');
        vila.score = null;
      } else {
        // console.log('5.2.3');
        vila.score = Math.round(skors.map((value) => value.Reviews[0].score).reduce((total,num) => total+num)*10 / skors.length)/10;
      }
      // console.log('5.3');
    }
    // console.log('6');

    let recommendVilas = JSON.parse(JSON.stringify(vilas));
    let popularVilas = JSON.parse(JSON.stringify(vilas));
    let ratingVilas = JSON.parse(JSON.stringify(vilas));
    // console.log('7');

    return NextResponse.json(
      {
        message: "sukses all villa",
        userData,
        // vilas,
        allVilas: vilas.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        ),
        recommendVilas: recommendVilas.sort(
          (a, b) =>
            a.jumlahTransaction +
            a.jumlahBookmark +
            a.score -
            (b.jumlahTransaction + b.jumlahBookmark + b.score)
        ),
        popularVilas: popularVilas.sort(
          (a, b) => a.jumlahTransaction + a.score - (b.jumlahTransaction + b.score)
        ),
        ratingVilas: ratingVilas.sort(
          (a, b) => a.jumlahReview + a.score - (b.jumlahReview + b.score)
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
