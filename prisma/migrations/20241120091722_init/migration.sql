/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Store_address_key" ON "Store"("address");
