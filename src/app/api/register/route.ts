import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, dob, address, role } = await request.json()

    console.log('Registration data received:', { name, email, phone, dob, address, role })

    // Validate input
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle date conversion
    let dobDate = null
    if (dob) {
      try {
        dobDate = new Date(dob)
        console.log('Converted DOB:', dobDate)
      } catch (error) {
        console.error('Error converting DOB:', error)
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        dob: dobDate,
        address: address || null,
        role: role || 'PATIENT'
      }
    })

    console.log('User created successfully:', { id: user.id, name: user.name, phone: user.phone, dob: user.dob, address: user.address, role: user.role })

    // Return user data without password
    const { password: _, ...userData } = user
    return NextResponse.json(userData, { status: 201 })

  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
} 