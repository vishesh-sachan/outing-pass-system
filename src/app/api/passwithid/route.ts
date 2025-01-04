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
   if (!user.role) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }
    
    
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id")
        const passId = Number(id)

        const res = await prisma.outingRequest.findUnique({
            where: {
                id: passId
            }
        });

        return NextResponse.json(res, { status: 200 })

    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "error fetching data" }, { status: 500 });
    }
}