/*
  Warnings:

  - The primary key for the `Stuff` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stuff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Stuff_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stuff" ("amount", "createdAt", "id", "name", "roomId", "updatedAt") SELECT "amount", "createdAt", "id", "name", "roomId", "updatedAt" FROM "Stuff";
DROP TABLE "Stuff";
ALTER TABLE "new_Stuff" RENAME TO "Stuff";
CREATE UNIQUE INDEX "Stuff_id_key" ON "Stuff"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
