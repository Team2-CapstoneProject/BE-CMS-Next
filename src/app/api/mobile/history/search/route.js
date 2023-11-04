import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("=== Searched History. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  const searchText = request.nextUrl.searchParams.get('searchText');

  try {
    let transactions = await prisma.transactions.findMany({
      where: {
        user_id: Number(userData.id),
        Vilas: {
          name: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      },
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

    return NextResponse.json(
      {
        message: "sukses searched transactions",
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
