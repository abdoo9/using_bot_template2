/*
  Warnings:

  - The primary key for the `replies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `replies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "replies" DROP CONSTRAINT "replies_pkey",
DROP COLUMN "id";
