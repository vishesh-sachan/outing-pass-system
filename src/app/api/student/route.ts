import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
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
        const id = searchParams.get("studentId");
        const studentId = Number(id)

        if (!studentId) {
            return NextResponse.json({ error: "StudentId is required" }, { status: 400 });
        }

        const res = await prisma.student.findFirst({
            where: {
                id: studentId
            }
        })

        if (res === null) {
            return NextResponse.json({ error: "Student with this id does not exists" }, { status: 404 });
        }

        return NextResponse.json(res, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "error fetching data" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json()
        const { name, fathersName, mothersName, course, branch, year, permanentAddress, personalPhoneNumber, fathersPhoneNumber, mothersPhoneNumber, allotedRoomNo, hostel, dateOfJoining, email } = body;

        if (!name || !fathersName || !mothersName || !course || !branch || !year || !permanentAddress || !personalPhoneNumber || !fathersPhoneNumber || !mothersPhoneNumber || !allotedRoomNo || !hostel || !dateOfJoining || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const res = await prisma.student.create({
            data: {
                name,
                fathersName,
                mothersName,
                course,
                branch,
                year,
                permanentAddress,
                personalPhoneNumber,
                fathersPhoneNumber,
                mothersPhoneNumber,
                allotedRoomNo,
                hostel,
                dateOfJoining,
                email
            },
            select: {
                id: true
            }
        });

        return NextResponse.json({ id: res.id }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "error creating student entry" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json()
        const { id, name, fathersName, mothersName, course, branch, year, permanentAddress, personalPhoneNumber, fathersPhoneNumber, mothersPhoneNumber, allotedRoomNo, hostel, dateOfJoining, email } = body;

        if (!id || !name || !fathersName || !mothersName || !course || !branch || !year || !permanentAddress || !personalPhoneNumber || !fathersPhoneNumber || !mothersPhoneNumber || !allotedRoomNo || !hostel || !dateOfJoining || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const res = await prisma.student.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                fathersName,
                mothersName,
                course,
                branch,
                year,
                permanentAddress,
                personalPhoneNumber,
                fathersPhoneNumber,
                mothersPhoneNumber,
                allotedRoomNo,
                hostel,
                dateOfJoining,
                email
            }
        })

        return NextResponse.json({ msg: "Student info updated successfully" }, { status: 200 });

    } catch (error: any) {
        
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Student with this id does not exists" }, { status: 404 });
        }

        console.log(error);
        return NextResponse.json({ error: "error updating data" }, { status: 500 });
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
        const studentId = searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
        }

        const res = await prisma.student.delete({
            where: {
                id: Number(studentId),
            },
        });

        return NextResponse.json({ msg: "Student entry deleted successfully" }, { status: 200 });

    } catch (error: any) {

        if (error.code === "P2025") {
            return NextResponse.json({ error: "Student with this id does not exists" }, { status: 404 });
        }
        console.log(error);
        
        return NextResponse.json({ error: "Error deleting student entry" }, { status: 500 });
    }
}