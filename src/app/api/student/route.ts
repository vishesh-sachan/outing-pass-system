import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req:Request){
    try{
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("studentId");
        const studentId = Number(id)

        if(!studentId){
          return NextResponse.json({error:"StudentId is required"},{status:400});
        }

        const res = await prisma.student.findFirst({
            where: {
                id : studentId
            }
        })
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
       return NextResponse.json({ error: "error fetching data" }, { status: 500 });
    }
}