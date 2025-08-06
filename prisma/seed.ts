import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Alice Patient',
        email: 'alice@patient.com',
        password,
        role: 'PATIENT',
      },
      {
        name: 'Bob Pharmacist',
        email: 'bob@pharma.com',
        password,
        role: 'PHARMACIST',
      },
      {
        name: 'Eve Employee',
        email: 'eve@employee.com',
        password,
        role: 'EMPLOYEE',
      },
      {
        name: 'Adam Admin',
        email: 'adam@admin.com',
        password,
        role: 'ADMIN',
      },
    ],
  });

  // Seed hospitals
  await prisma.hospital.createMany({
    data: [
      {
        name: 'City General Hospital',
        address: '123 Main St, Metropolis',
        contact: '123-456-7890',
      },
      {
        name: 'Sunrise Medical Center',
        address: '456 Elm St, Springfield',
        contact: '987-654-3210',
      },
      {
        name: 'Lakeside Hospital',
        address: '789 Lake Ave, Lakeview',
        contact: '555-123-4567',
      },
    ],
  });

  console.log('Seeded users!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
