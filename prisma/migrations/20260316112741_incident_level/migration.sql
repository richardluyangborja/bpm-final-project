/*
  Warnings:

  - Added the required column `incidentLevel` to the `AuditTrail` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IncidentLevel" AS ENUM ('INFO', 'DANGER');

-- AlterTable
ALTER TABLE "AuditTrail" ADD COLUMN     "incidentLevel" "IncidentLevel" NOT NULL;
