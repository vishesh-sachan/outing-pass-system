/*
  Warnings:

  - Added the required column `encryptionKey` to the `OutingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OutingRequest" ADD COLUMN     "encryptionKey" TEXT NOT NULL;
