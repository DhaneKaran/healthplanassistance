import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  const hospitals = await prisma.hospital.findMany();
  return NextResponse.json(hospitals);
} 