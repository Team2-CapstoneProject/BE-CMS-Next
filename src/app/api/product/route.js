import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const data = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    const products = data.map((product) => ({
      ...product,
      price: product.price.toString(),
    }));

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 });
  }
}
