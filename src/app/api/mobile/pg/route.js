import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";
const midtransClient = require("midtrans-client");

export async function GET(request) {
  console.log("=== payment gateway GET");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  const order_id = request.nextUrl.searchParams.get('order_id');
  const gross_amount = request.nextUrl.searchParams.get('gross_amount');
  const secretKey = process.env.SERVER_ID;

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: secretKey,
  });

  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(userData.id) },
    });

    let parameter = {
      transaction_details: {
        order_id: Number(order_id),
        gross_amount: Number(gross_amount),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.nickname,
        last_name: user.fullname,
        email: user.email,
        phone: user.phone_number,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json(
      {
        message: "retrieve transaction token",
        transaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
