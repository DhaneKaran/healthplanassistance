/*
  Warnings:

  - Added the required column `description` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Doctor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "qualifications" TEXT NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "availability" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Doctor" ("availability", "createdAt", "experience", "hospitalId", "id", "name", "qualifications", "specialization", "updatedAt") SELECT "availability", "createdAt", "experience", "hospitalId", "id", "name", "qualifications", "specialization", "updatedAt" FROM "Doctor";
DROP TABLE "Doctor";
ALTER TABLE "new_Doctor" RENAME TO "Doctor";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
