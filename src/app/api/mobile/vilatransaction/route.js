import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== post transaction. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  const formData = await request.formData();
  let vila_id = formData.get("vila_id");
  let n_guest = formData.get("n_guest");
  let price = formData.get("price");
  let taxes = formData.get("taxes");
  let tgl_checkin = formData.get("tgl_checkin");
  let tgl_checkout = formData.get("tgl_checkout");
  let full_name = formData.get("full_name");
  let phone_number = formData.get("phone_number");

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

  try {
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
