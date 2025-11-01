/*
  Warnings:

  - The `reason` column on the `SickLeave` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `comment` column on the `SickLeave` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SickLeave" DROP COLUMN "reason",
ADD COLUMN     "reason" BYTEA,
DROP COLUMN "comment",
ADD COLUMN     "comment" BYTEA;
