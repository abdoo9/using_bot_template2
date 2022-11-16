/*
  Warnings:

  - Made the column `text` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "text" SET DEFAULT ' ';
