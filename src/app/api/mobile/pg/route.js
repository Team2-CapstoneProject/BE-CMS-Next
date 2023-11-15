import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function GET(request) {
  console.log("=== payment gateway GET");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  const vilaId = request.nextUrl.searchParams.get('vila_id');
  const nNight = request.nextUrl.searchParams.get('n_night');
  const secretKey = process.env.SERVER_ID;
  const secretClientKey = process.env.CLIENT_ID;

  console.log('1');

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: secretKey,
    clientKey: secretClientKey
  });

  console.log('2');

  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(userData.id) },
    });

    const vila = await prisma.vilas.findUnique({
      where: { id: Number(vilaId) },
    });

    console.log('3');

    if (! vila) {
      return NextResponse.json({
        message: 'Vila id is not found.'
      }, {
        status: 404
      });
    }

    console.log('4');

    const price = vila.price;
    const tax = (price*nNight) * 0.05;

    console.log('5');

    let parameter = {
      "transaction_details": {
        "order_id": "order-id-node-"+Math.round((new Date()).getTime() / 1000),
        "gross_amount": price*nNight + tax
      }, "credit_card":{
        "secure" : true
      }, "item_details": [
        {
          "id": "Vila-"+vilaId,
          "price": price,
          "quantity": nNight,
          "name": vila.name
        },
        {
          "id": "Tax-"+vilaId,
          "price": tax,
          "quantity": 1,
          "name": vila.name + ' tax'
        }
      ],"customer_details":{
        "first_name": user.nickname,
        "last_name": user.fullname,
        "email": user.email,
        "phone": user.phone_number,
      },
    };

    console.log('6');

    const transaction = await snap.createTransaction(parameter);

    console.log('7');

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
