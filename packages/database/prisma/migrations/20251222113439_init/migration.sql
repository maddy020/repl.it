/*
  Warnings:

  - A unique constraint covering the columns `[replId]` on the table `Repl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Repl_replId_key" ON "Repl"("replId");
