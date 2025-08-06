/*
  Warnings:

  - Added the required column `doctorId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Doctor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "qualifications" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "availability" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BOOKED',
    "medicalHistory" TEXT,
    "symptoms" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" REAL NOT NULL DEFAULT 20.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("createdAt", "date", "hospitalId", "id", "patientId", "status") SELECT "createdAt", "date", "hospitalId", "id", "patientId", "status" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE TABLE "new_Bill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "appointmentId" INTEGER,
    "patientId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'APPOINTMENT',
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bill_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bill_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bill" ("amount", "appointmentId", "createdAt", "id", "paidAt", "patientId", "status") SELECT "amount", "appointmentId", "createdAt", "id", "paidAt", "patientId", "status" FROM "Bill";
DROP TABLE "Bill";
ALTER TABLE "new_Bill" RENAME TO "Bill";
CREATE UNIQUE INDEX "Bill_appointmentId_key" ON "Bill"("appointmentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
