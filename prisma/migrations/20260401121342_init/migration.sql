/*
  Warnings:

  - You are about to alter the column `rating` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(3,1)`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "rating" SET DATA TYPE DECIMAL(3,1),
ALTER COLUMN "numReviews" SET DEFAULT 0;
