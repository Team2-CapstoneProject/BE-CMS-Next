import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authHelper';
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== Post a review.");
  const requestHeaders = new Headers(request.headers);
  const bearerHeader = requestHeaders.get("authorization");
  const userData = verifyToken(bearerHeader);

  try {
    let description, score, transactionId;

    if ( requestHeaders.get('content-type').includes('json') ) {
      const jsonData = await request.json();
      console.log('=== json data: ', jsonData);
      description = jsonData.description;
      score = jsonData.score;
      transactionId = jsonData.transactionId;
    } else if ( requestHeaders.get('content-type').includes('x-www-form-urlencoded') ) {
      const formData = await request.formData();
      console.log('=== form data: ', formData);
      description = formData.get("description");
      score = formData.get("score");
      transactionId = formData.get("transactionId");
    }

    let review = await prisma.reviews.findFirst({
      where: {
        transaction_id: Number(transactionId)
      }
    });

    if (! review) {
      return NextResponse.json(
        { message: "Transaction is not found." },
        { status: 404 }
      );
    }

    console.log('1: ', review);

    if (userData.id !== review.user_id) {
      return NextResponse.json(
        { message: "Cannot edit other's review" },
        { status: 400 }
      );
    }

    console.log('2');

    const successUpdate = await prisma.reviews.update({
      where: {
        id: Number(review.id)
      },
      data: {
        score: Number(score),
        description,
      }
    });

    console.log('3');

    if (successUpdate) {
      return NextResponse.json({
        message: "Thank you for the review."
      }, {status: 201});
    } else {
      return NextResponse.json({
        message: "The review is failed."
      }, {status: 201});
    }

  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}