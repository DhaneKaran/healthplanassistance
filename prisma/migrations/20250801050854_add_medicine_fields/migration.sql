/*
  Warnings:

  - Added the required column `dosageForm` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `use` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Medicine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "use" TEXT NOT NULL,
    "dosageForm" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL DEFAULT 'Generic',
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'General',
    "prescription" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Medicine" ("id", "manufacturer", "name", "price", "stock") SELECT "id", "manufacturer", "name", "price", "stock" FROM "Medicine";
DROP TABLE "Medicine";
ALTER TABLE "new_Medicine" RENAME TO "Medicine";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "medicineId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalAmount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "status" TEXT NOT NULL DEFAULT 'PLACED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "medicineId", "patientId", "quantity", "status") SELECT "createdAt", "id", "medicineId", "patientId", "quantity", "status" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
