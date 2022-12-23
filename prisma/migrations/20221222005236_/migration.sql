/*
  Warnings:

  - You are about to drop the column `can_invite_users` on the `bot_chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bot_chats" DROP COLUMN "can_invite_users",
ADD COLUMN     "canInviteUsers" BOOLEAN NOT NULL DEFAULT false;
