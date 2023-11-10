import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("=== allVila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const oldUserData = verifyToken(bearerHeader);

  try {
    const userData = await prisma.users.findUnique({
      where: {
        id: Number(oldUserData.id)
      }
    });

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
          },
        },
      },
    });
    vilas = JSON.parse(JSON.stringify(vilas));

    for (let vila of vilas) {
      let skors = vila.Transactions.filter((value) => {
        if (value.Reviews.length !== 0) {
          return true;
        } else {
          return false;
        }
      });
      vila.VilaImages = vila.VilaImages[0];
      vila.nBookmark = vila.Bookmarks.length;
      vila.nTransaction = vila.Transactions.length;
      vila.nReview = skors.length;
      if (vila.nReview === 1) {
        vila.score = skors[0].Reviews[0].score;
      } else if (vila.nReview === 0) {
        vila.score = null;
      } else {
        vila.score =
          Math.round(
            (skors.reduce(
              (total, num) => total.Reviews[0].score + num.Reviews[0].score
            ) *
              10) /
              skors.length
          ) / 10;
      }
    }

    let recommendVilas = JSON.parse(JSON.stringify(vilas));
    let popularVilas = JSON.parse(JSON.stringify(vilas));
    let ratingVilas = JSON.parse(JSON.stringify(vilas));

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
            a.nTransaction +
            a.nBookmark +
            a.score -
            (b.nTransaction + b.nBookmark + b.score)
        ),
        popularVilas: popularVilas.sort(
          (a, b) => a.nTransaction + a.score - (b.nTransaction + b.score)
        ),
        ratingVilas: ratingVilas.sort(
          (a, b) => a.nReview + a.score - (b.nReview + b.score)
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
