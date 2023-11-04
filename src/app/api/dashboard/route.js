import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("--- main dashboard.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  if (userData.email !== "admin") {
    return NextResponse.json(
      {
        message: "You must login as admin.",
      },
      { status: 500 }
    );
  }
  try {
    let dashboard = await prisma.vilas.findMany({
      select: {
        id: true,
        status: true,
        Transactions: {
          select: {
            id: true,
            tgl_checkin: true,
            tgl_checkout: true,
            TransactionStatuses: {
              select: {
                status_id: true,
              },
            },
          },
        },
      },
    });
    dashboard = JSON.parse(JSON.stringify(dashboard));

    let nCheckIn = 0;
    let nCheckOut = 0;
    let nVila = dashboard.length;
    let nAvailVila = 0;
    let notAvailVila = 0;
    let today = new Date().toISOString().substring(0, 10);

    for (let vila of dashboard) {
      let cek = 0;
      for (let trx of vila.Transactions) {
        if (
          new Date(trx.tgl_checkin).toISOString().substring(0, 10) === today
        ) {
          nCheckIn++;
        }
        if (
          new Date(trx.tgl_checkout).toISOString().substring(0, 10) === today
        ) {
          nCheckOut++;
        }
        if (
          new Date(trx.tgl_checkin) < today &&
          new Date(trx.tgl_checkout) > today &&
          cek === 0
        ) {
          notAvailVila++;
          cek = 1;
        }
      }
    }
    nAvailVila = nVila - notAvailVila;

    return NextResponse.json(
      {
        message: "Main Dashboard",
        // dashboard,
        nCheckIn,
        nCheckOut,
        nVila,
        nAvailVila,
        notAvailVila,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
