/*
  Warnings:

  - You are about to drop the column `name` on the `Repl` table. All the data in the column will be lost.
  - Added the required column `replId` to the `Repl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repl" DROP COLUMN "name",
ADD COLUMN     "replId" TEXT NOT NULL;
