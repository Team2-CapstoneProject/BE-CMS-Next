import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/authHelper";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  console.log("=== detailed vila. ");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  const id = Number(params.id);

  try {
    const transactions = await prisma.transactions.findMany({
      where: { vila_id: Number(id) },
      select: {
        id: true,
        tgl_checkin: true,
        tgl_checkout: true,
        TransactionStatuses: {
          select: {
            id: true,
            status_id: true,
            updatedAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: `Vila id: ${id}`,
      transactions,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
