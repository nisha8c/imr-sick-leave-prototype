/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `SickLeave` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SickLeave_date_key" ON "SickLeave"("date");
