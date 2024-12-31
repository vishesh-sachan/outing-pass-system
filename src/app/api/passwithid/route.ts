import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")
    const passId = Number(id)


    try {

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