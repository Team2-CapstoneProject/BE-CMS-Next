import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== post transaction. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let vila_id, n_guest, price, taxes, tgl_checkin, tgl_checkout, full_name, phone_number;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      vila_id = jsonData.vila_id;
      n_guest = jsonData.n_guest;
      price = jsonData.price;
      taxes = jsonData.taxes;
      tgl_checkin = jsonData.tgl_checkin;
      tgl_checkout = jsonData.tgl_checkout;
      full_name = jsonData.full_name;
      phone_number = jsonData.phone_number;

    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      vila_id = formData.get("vila_id");
      n_guest = formData.get("n_guest");
      price = formData.get("price");
      taxes = formData.get("taxes");
      tgl_checkin = formData.get("tgl_checkin");
      tgl_checkout = formData.get("tgl_checkout");
      full_name = formData.get("full_name");
      phone_number = formData.get("phone_number");
    }

    if (
      !vila_id ||
      !n_guest ||
      !price ||
      !taxes ||
      !tgl_checkin ||
      !tgl_checkout ||
      !full_name ||
      !phone_number
    ) {
      return NextResponse.json(
        { message: "All fields must be filled in." },
        { status: 400 }
      );
    }

    const tglCheckIn = new Date(tgl_checkin);
    const tglCheckOut = new Date(tgl_checkout);

    if (isNaN(tglCheckIn.getTime()) || isNaN(tglCheckOut.getTime())) {
      return NextResponse.json(
        { message: "Check-in or check-out date is not valid" },
        { status: 400 }
      );
    }

    const newTransaction = await prisma.transactions.create({
      data: {
        user_id: userData.id,
        vila_id: Number(vila_id),
        n_guest: Number(n_guest),
        price: Number(price),
        taxes: Number(taxes),
        tgl_checkin: tglCheckIn,
        tgl_checkout: tglCheckOut,
        full_name,
        phone_number,
      },
    });

    return NextResponse.json(
      {
        message: `Transaction record is success.`,
        newTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
