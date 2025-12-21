-- CreateEnum
CREATE TYPE "ReplStatus" AS ENUM ('CREATING', 'PROVISIONING', 'RUNNING', 'FAILED', 'STOPPED', 'DELETING');

-- CreateTable
CREATE TABLE "Repl" (
    "id" SERIAL NOT NULL,
    "status" "ReplStatus" NOT NULL DEFAULT 'CREATING',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Repl_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Repl" ADD CONSTRAINT "Repl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
