import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: parseInt(patientId)
      },
      include: {
        hospital: true,
        doctor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const {
      patientId,
      hospitalId,
      doctorId,
      date,
      time,
      medicalHistory,
      symptoms,
      paymentMethod,
      amount
    } = await req.json()

    if (!patientId || !hospitalId || !doctorId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if the time slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        time,
        status: {
          not: 'CANCELLED'
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        hospitalId,
        doctorId,
        date: new Date(date),
        time,
        medicalHistory: medicalHistory || null,
        symptoms: symptoms || null,
        paymentStatus: paymentMethod === 'UPI' ? 'PENDING' : 'PENDING',
        amount: amount || 20.0
      },
      include: {
        hospital: true,
        doctor: true
      }
    })

    // Create bill for the appointment
    await prisma.bill.create({
      data: {
        appointmentId: appointment.id,
        patientId,
        amount: appointment.amount,
        type: 'APPOINTMENT',
        description: `Appointment with ${appointment.doctor.name} at ${appointment.hospital.name}`,
        status: 'UNPAID'
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
} 