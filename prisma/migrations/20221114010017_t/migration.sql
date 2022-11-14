/*
  Warnings:

  - You are about to drop the column `successorId` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[predecessorId]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_successorId_fkey";

-- DropIndex
DROP INDEX "messages_successorId_key";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "successorId",
ADD COLUMN     "predecessorId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "messages_predecessorId_key" ON "messages"("predecessorId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
