import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export function POST(request) {
  console.log("--- logout.");
  return NextResponse.json({
    message: "successfully logout",
  }, { status: 200 });
}
