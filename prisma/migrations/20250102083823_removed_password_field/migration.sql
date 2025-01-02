/*
  Warnings:

  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `faculty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "faculty" DROP COLUMN "password";
