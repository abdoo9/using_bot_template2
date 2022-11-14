/*
  Warnings:

  - You are about to alter the column `message_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[successorId]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "successorId" INTEGER,
ALTER COLUMN "message_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_successorId_key" ON "messages"("successorId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_successorId_fkey" FOREIGN KEY ("successorId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
