/*
  Warnings:

  - You are about to drop the column `message` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the column `parse_mode` on the `replies` table. All the data in the column will be lost.
  - Added the required column `chat_id` to the `replies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_id` to the `replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "replies" DROP COLUMN "message",
DROP COLUMN "parse_mode",
ADD COLUMN     "chat_id" INTEGER NOT NULL,
ADD COLUMN     "message_id" INTEGER NOT NULL;
