import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request) {
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