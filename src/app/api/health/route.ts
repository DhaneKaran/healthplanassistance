import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    // Simple database check
    await prisma.user.findFirst();
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }
} 