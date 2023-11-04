import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("=== all History. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let transactions = await prisma.transactions.findMany({
      where: { user_id: Number(userData.id) },
      select: {
        id: true,
        tgl_checkin: true,
        tgl_checkout: true,
        full_name: true,
        createdAt: true,
        Vilas: {
          select: {
            id: true,
            name: true,
            price: true,
            location: true,
            VilaImages: {
              select: {
                id: true,
                slider_image: true,
              },
              orderBy: {
                id: "asc",
              },
            },
            Bookmarks: {
              where: {
                user_id: Number(userData.id),
              },
              select: {
                createdAt: true,
              },
            },
          },
        },
        TransactionStatuses: {
          select: {
            id: true,
            status_id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    transactions = JSON.parse(JSON.stringify(transactions));

    // for (let vila of vilas) {
    //   let skors = vila.Transactions.filter((value) => {
    //     if (value.Review !== null) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   });
    //   vila.VilaImages = vila.VilaImages[0];
    //   vila.updatedAt = new Date(vila.updatedAt);
    //   vila.nBookmark = vila.Bookmarks.length;
    //   vila.nTransaction = vila.Transactions.length;
    //   vila.nReview = skors.length;
    //   if (vila.nReview === 1) {
    //     vila.score = skors[0].Review.score;
    //   } else if (vila.nReview === 0) {
    //     vila.score = null;
    //   } else {
    //     vila.score =
    //       Math.round(
    //         (skors.reduce(
    //           (total, num) => total.Review.score + num.Review.score
    //         ) *
    //           10) /
    //           skors.length
    //       ) / 10;
    //   }
    // }

    // let recommendVilas = JSON.parse(JSON.stringify(vilas));
    // let popularVilas = JSON.parse(JSON.stringify(vilas));
    // let ratingVilas = JSON.parse(JSON.stringify(vilas));

    // if (req.query.homeType === "recommend") {
    //   console.log('--- next recommend');
    //   req.user.vilas = vilas;
    //   return next();
    // }

    return NextResponse.json(
      {
        message: "sukses all transactions",
        allTransactions: transactions.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        ),
        // recommendVilas: recommendVilas.sort(
        //   (a, b) =>
        //     a.nTransaction +
        //     a.nBookmark +
        //     a.score -
        //     (b.nTransaction + b.nBookmark + b.score)
        // ),
        // popularVilas: popularVilas.sort(
        //   (a, b) => a.nTransaction + a.score - (b.nTransaction + b.score)
        // ),
        // ratingVilas: ratingVilas.sort(
        //   (a, b) => a.nReview + a.score - (b.nReview + b.score)
        // ),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
