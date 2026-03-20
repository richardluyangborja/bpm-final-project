/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Borrower` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Borrower" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_email_key" ON "Borrower"("email");
