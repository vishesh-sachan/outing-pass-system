-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'warden', 'guard');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'approved', 'rejected', 'closed');

-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('csecore', 'csecybersecurity', 'cseaiml', 'csedatascience', 'ece', 'eee', 'ee', 'civil', 'agriculture', 'nursing');

-- CreateEnum
CREATE TYPE "Course" AS ENUM ('btech', 'bsc', 'msc', 'mba', 'bba', 'bcom', 'bpharma', 'dpharma');

-- CreateEnum
CREATE TYPE "Hostel" AS ENUM ('kdbhawan', 'mlbhawan');

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fathersName" TEXT NOT NULL,
    "mothersName" TEXT NOT NULL,
    "course" "Course" NOT NULL,
    "branch" "Branch" NOT NULL,
    "year" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "localGaurdiansName" TEXT,
    "localGaurdiansAddress" TEXT,
    "personalPhoneNumber" TEXT NOT NULL,
    "fathersPhoneNumber" TEXT NOT NULL,
    "mothersPhoneNumber" TEXT NOT NULL,
    "localGaurdianPhoneNumber" TEXT,
    "allotedRoomNo" TEXT NOT NULL,
    "hostel" "Hostel" NOT NULL,
    "dateOfJoining" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "outingsIds" TEXT[],

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fathersnName" TEXT NOT NULL,
    "mothersName" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "personalPhoneNumber" TEXT NOT NULL,
    "fathersPhoneNumber" TEXT NOT NULL,
    "mothersPhoneNumber" TEXT NOT NULL,
    "allotedRoomNo" TEXT NOT NULL,
    "allotedHostel" "Hostel" NOT NULL,
    "dateOfJoining" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutingRequest" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "actualstartTime" TIMESTAMP(3),
    "actualendTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- AddForeignKey
ALTER TABLE "OutingRequest" ADD CONSTRAINT "OutingRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
