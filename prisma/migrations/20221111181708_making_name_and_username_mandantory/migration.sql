/*
  Warnings:

  - Made the column `first_name` on table `bots` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `bots` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bots" ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "first_name" SET DEFAULT 'bot',
ALTER COLUMN "username" SET NOT NULL;
