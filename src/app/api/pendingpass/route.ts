import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
       if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       }
    
       const { user } = session;
       if (!user || (user.role !== "admin" && user.role !== "warden")) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
       }
    try {

        const res = await prisma.outingRequest.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    lte: new Date()
                },
                status: "pending"
            }
        });

        return NextResponse.json(res, { status: 200 })

    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "error fetching data" }, { status: 500 });
    }
}