import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  console.log("=== specific history.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  const id = Number(params.id);

  try {
    const transaction = await prisma.transactions.findFirst({
      where: { id: Number(id) },
      select: {
        tgl_checkin: true,
        tgl_checkout: true,
        full_name: true,
        n_guest: true,
        price: true,
        taxes: true,
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
              take: 1,
            },
            Bookmarks: {
              where: {
                user_id: Number(userData.id),
              },
              select: {
                createdAt: true,
              },
            },
          }
        },
        TransactionStatuses: {
          select: {
            status_id: true,
          }
        }
      }
    });

    if (!transaction) {
      return NextResponse.json({message: "Vila is not found."}, { status: 404 })
    }

    return NextResponse.json({
      tgl_checkin: transaction.tgl_checkin,
      tgl_checkout: transaction.tgl_checkout,
      full_name: transaction.full_name,
      n_guest: transaction.n_guest,
      total_price: transaction.price,
      taxes: transaction.taxes,
      vila_name: transaction.Vilas.name,
      vila_price: transaction.Vilas.price,
      vila_location: transaction.Vilas.location,
      vila_image: transaction.Vilas.VilaImages.length > 0 ? transaction.Vilas.VilaImages[0].slider_image : null,
      is_bookmark: transaction.Vilas.Bookmarks.length > 0,
      transaction_status: transaction.TransactionStatuses.length > 0 ? transaction.TransactionStatuses[0].status_id : 1
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST(request, { params }) {
  console.log("=== specific history.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  const id = Number(params.id);

  let transactionType;

  try {
    if (requestHeaders.get("content-type").includes("json")) {
      const jsonData = await request.json();
      transactionType = jsonData.transactionType;
    } else if (requestHeaders.get("content-type").includes("x-www-form-urlencoded")) {
      const formData = await request.formData();
      transactionType = formData.get("transactionType");
    }

    const transaction = await prisma.transactionStatuses.findFirst({
      where: { transaction_id: Number(id) },
      select: {
        status_id: true,
        Transactions: {
          select: {
            user_id: true
          }
        }
      }
    });

    if (!transaction) {
      return NextResponse.json({ message: "Transaction status is not found" }, { status: 404 });
    }
    if (userData.id !== transaction.Transactions.user_id) {
      return NextResponse.json({ message: "Cannot edit other's status" }, { status: 400 });
    }
    if (transaction.status_id === 1) {
      await prisma.transactionStatuses.updateMany({
        where: { transaction_id: id },
        data: { status_id: transactionType === "pay" ? 2 : 3 }
      });

      return NextResponse.json({ message: "Transaction status changed to "+transactionType }, { status: 201 });
    } else {
      return NextResponse.json({ message: "Cannot change status" }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}