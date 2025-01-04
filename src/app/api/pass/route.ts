import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const { user } = session;
   if (!user.role) {
      try{
         const { searchParams } = new URL(req.url);
         const id = searchParams.get("studentId");
         const studentId = Number(id);
         if(studentId != user.id){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      }catch(error){
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
   }

   try {
      const { searchParams } = new URL(req.url);
      const all = searchParams.get("all");
      const id = searchParams.get("studentId");
      const studentId = Number(id);

      let res;
      if (!studentId && !all) {
         res = await prisma.outingRequest.findMany({
            where: {
               createdAt: {
                  gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                  lte: new Date()
               }
            }
         });
      } else if (!studentId && all) {
         res = await prisma.outingRequest.findMany();
      } else {
         res = await prisma.outingRequest.findMany({
            where: {
               studentId: studentId
            }
         });
      }

      return NextResponse.json(res, { status: 200 });
   } catch (error) {
      return NextResponse.json({ error: "error fetching data" }, { status: 500 });
   }
}

export async function POST(req: Request) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const { user } = session;
   if (!user.role) {
      const body = await req.json();
      const { studentId, reason, startTime, endTime } = body;
      try{
         if(studentId != user.id){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
         }else{
            try {
         
               if (!studentId || !reason || !startTime || !endTime) {
                  return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
               }
         
               const saltRounds = 10;
               const value = `${studentId}${reason}`;
               const encryptionKey = await bcrypt.hash(value, saltRounds);
         
               const res = await prisma.outingRequest.create({
                  data: {
                     studentId: Number(studentId),
                     reason,
                     startTime: new Date(startTime),
                     endTime: new Date(endTime),
                     createdAt: new Date(),
                     encryptionKey
                  },
                  select: {
                     id: true,
                  },
               });
         
               return NextResponse.json({ id: res.id }, { status: 201 });
            } catch (error) {
               console.log(error);
               return NextResponse.json({ error: "Error creating outing request" }, { status: 500 });
            }
         }
      }catch(error){
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
   }else{
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }

}

export async function PUT(req: Request) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const { user } = session;
   if (!user || (user.role !== "admin" && user.role !== "warden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }

   try {
      const body = await req.json();
      const { passId, status } = body;

      if (!passId || !status) {
         return NextResponse.json({ error: "Pass ID and status are required" }, { status: 400 });
      }

      const validStatuses = ["pending", "approved", "rejected", "closed"];
      if (!validStatuses.includes(status)) {
         return NextResponse.json({ error: "Invalid status. Allowed values are: pending, approved, rejected, closed" }, { status: 400 });
      }

      const res = await prisma.outingRequest.update({
         where: {
            id: Number(passId),
         },
         data: {
            status,
         },
         select: {
            id: true,
            status: true,
         },
      });

      return NextResponse.json({ msg: "Outing request updated successfully", data: res }, { status: 200 });
   } catch (error: any) {
      if (error.code === "P2025") {
         return NextResponse.json({ error: "Outing request not found" }, { status: 404 });
      }

      return NextResponse.json({ error: "Error updating outing request" }, { status: 500 });
   }
}

export async function DELETE(req: Request) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const { user } = session;
   if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }

   try {
      const { searchParams } = new URL(req.url);
      const passId = searchParams.get("passId");

      if (!passId) {
         return NextResponse.json({ error: "Pass ID is required" }, { status: 400 });
      }

      const res = await prisma.outingRequest.delete({
         where: {
            id: Number(passId),
         },
      });

      return NextResponse.json({ msg: `Outing request with ID ${res.id} deleted successfully` }, { status: 200 });
   } catch (error: any) {
      if (error.code === "P2025") {
         return NextResponse.json({ error: "Outing request not found" }, { status: 404 });
      }

      return NextResponse.json({ error: "Error deleting outing request" }, { status: 500 });
   }
}