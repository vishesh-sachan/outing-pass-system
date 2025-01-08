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
        
        const now = new Date(); 
        const todayUTCStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        
        
        const tomorrowUTCStart = new Date(todayUTCStart);
        tomorrowUTCStart.setUTCDate(tomorrowUTCStart.getUTCDate() + 1);
    
        // console.log({ todayUTCStart, tomorrowUTCStart });
    
        
        const res = await prisma.outingRequest.findMany({
            where: {
                startTime: {
                    gte: todayUTCStart,
                    lt: tomorrowUTCStart,
                },
                status: { in: ["approved", "closed"] },
                actualstartTime: { not: null },
            },
        });
    
        // console.log("Query Result:", res);
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}