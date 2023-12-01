import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";

export async function POST(request) {
  console.log("=== payment gateway POST");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);
  const secretKey = process.env.SERVER_ID;
  const secretClientKey = process.env.CLIENT_ID;

  // console.log('1');

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: secretKey,
    clientKey: secretClientKey
  });

  // console.log('2');

  try {
    let vilaId, nNight, tglCheckin, tglCheckout;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      vilaId = jsonData.vilaId;
      nNight = jsonData.nNight;
      tglCheckin = jsonData.tglCheckin;
      tglCheckout = jsonData.tglCheckout;
    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      vilaId = formData.get("vilaId");
      nNight = formData.get("nNight");
      tglCheckin = formData.get("tglCheckin");
      tglCheckout = formData.get("tglCheckout");
    }

    const user = await prisma.users.findUnique({
      where: { id: Number(userData.id) },
    });

    const vila = await prisma.vilas.findUnique({
      where: { id: Number(vilaId) },
    });

    // console.log('3');

    if (! vila) {
      return NextResponse.json({
        message: 'Vila id is not found.'
      }, {
        status: 404
      });
    }

    // console.log('4');

    const price = vila.price*nNight;
    const tax = price * 0.05;

    // console.log('5');

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

    // console.log('6');

    const transaction = await snap.createTransaction(parameter);
    
    // console.log('7');

    console.log('data checkin new', new Date(tglCheckin));
    console.log('data checkin parse', Date.parse(tglCheckin));
    console.log('user: ', user);
    console.log('tax: ', tax);

    const newTransaction = await prisma.transactions.create({
      data: {
        user_id: Number(user.id),
        vila_id: Number(vilaId),
        n_guest: 3,
        price: Number(price),
        taxes: Number(tax),
        tgl_checkin: new Date(tglCheckin),
        tgl_checkout: new Date(tglCheckout),
        full_name: user.fullname,
        phone_number: user.phone_number,
      },
    });

    // console.log('8');

    await prisma.transactionStatuses.create({
      data: {
        transaction_id: newTransaction.id,
        status_id: 1,
      },
    });

    // console.log('9');

    return NextResponse.json(
      {
        message: "retrieve transaction token",
        transaction_token: transaction.token,
        transaction_url: transaction.redirect_url,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
