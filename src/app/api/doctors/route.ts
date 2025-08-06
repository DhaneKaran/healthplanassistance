import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const hospital = searchParams.get('hospital')

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital parameter is required' }, { status: 400 })
    }

    const doctors = await prisma.doctor.findMany({
      where: {
        hospital: {
          name: {
            contains: hospital
          }
        }
      },
      include: {
        hospital: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(doctors)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    )
  }
} 