/*
  Warnings:

  - You are about to drop the column `can_join_groups` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `can_read_all_group_messages` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `supports_inline_queries` on the `bots` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bots" DROP COLUMN "can_join_groups",
DROP COLUMN "can_read_all_group_messages",
DROP COLUMN "supports_inline_queries";
