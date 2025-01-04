import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
   const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({msg:"unauthorised"},{status:403})
    }else{
      const { user } = session;
      if (user.role == "guard" || user.role == "admin") {
         try {
            const body = await req.json();
            const { passId, mode } = body;
      
            if (!passId || !mode) {
               return NextResponse.json({ error: "Pass ID and Mode are required" }, { status: 400 });
            }
      
            const validMode = ["entry", "exit"];
            if (!validMode.includes(mode)) {
               return NextResponse.json({ error: "Invalid Mode. Allowed values are: entry, exit" }, { status: 400 });
            }
      
            if(mode === "exit"){
                const res = await prisma.outingRequest.update({
                   where: {
                      id: Number(passId),
                   },
                   data: {
                      actualstartTime:new Date()
                   },
                   select: {
                      id: true,
                      actualstartTime: true,
                   },
                });
                return NextResponse.json({ msg: "Outing request updated successfully", data: res }, { status: 200 });
              }else {
                  const res = await prisma.outingRequest.update({
                     where: {
                        id: Number(passId),
                     },
                     data: {
                        actualendTime:new Date(),
                        status:"closed"
                     },
                     select: {
                        id: true,
                        actualendTime: true,
                     },
                  });
                  return NextResponse.json({ msg: "Outing request updated successfully", data: res }, { status: 200 });
              }
      
         } catch (error: any) {
            if (error.code === "P2025") {
               return NextResponse.json({ error: "Outing request not found" }, { status: 404 });
            }
      
            return NextResponse.json({ error: "Error updating outing request" }, { status: 500 });
         }
      }else{
         return NextResponse.json({ msg: "access denied" }, { status: 403 });
      }
    }
}