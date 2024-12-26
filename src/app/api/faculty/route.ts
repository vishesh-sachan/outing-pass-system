import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("facultyId");
        const facultyId = Number(id)

        if (!facultyId) {
            return NextResponse.json({ error: "FacultyId is required" }, { status: 400 });
        }

        const res = await prisma.faculty.findFirst({
            where: {
                id: facultyId
            }
        })

        if (res === null) {
            return NextResponse.json({ error: "Faculty with this id does not exists" }, { status: 404 });
        }

        return NextResponse.json(res, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "error fetching data" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, fathersnName, mothersName, permanentAddress, personalPhoneNumber, fathersPhoneNumber, mothersPhoneNumber, allotedRoomNo, allotedHostel, dateOfJoining, role, email, password } = body;

        if (!name || !fathersnName || !mothersName || !permanentAddress || !personalPhoneNumber || !fathersPhoneNumber || !mothersPhoneNumber || !allotedRoomNo || !allotedHostel || !dateOfJoining || !role || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const res = await prisma.faculty.create({
            data: {
                name,
                fathersnName,
                mothersName,
                permanentAddress,
                personalPhoneNumber,
                fathersPhoneNumber,
                mothersPhoneNumber,
                allotedRoomNo,
                allotedHostel,
                dateOfJoining,
                role,
                email,
                password
            },
            select: {
                id: true
            }
        });

        return NextResponse.json({ id: res.id }, { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "error creating faculty entry" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, name, fathersnName, mothersName, permanentAddress, personalPhoneNumber, fathersPhoneNumber, mothersPhoneNumber, allotedRoomNo, allotedHostel, dateOfJoining, role, email } = body;

        if (!id || !name || !fathersnName || !mothersName || !permanentAddress || !personalPhoneNumber || !fathersPhoneNumber || !mothersPhoneNumber || !allotedRoomNo || !allotedHostel || !dateOfJoining || !role || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const res = await prisma.faculty.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                fathersnName,
                mothersName,
                permanentAddress,
                personalPhoneNumber,
                fathersPhoneNumber,
                mothersPhoneNumber,
                allotedRoomNo,
                allotedHostel,
                dateOfJoining,
                role,
                email
            }
        })

        return NextResponse.json({ msg: "Faculty info updated successfully" }, { status: 200 });

    } catch (error: any) {

        if (error.code === "P2025") {
            return NextResponse.json({ error: "Faculty with this id does not exists" }, { status: 404 });
        }

        console.log(error);
        return NextResponse.json({ error: "error updating data" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const facultyId = searchParams.get("facultyId");

        if (!facultyId) {
            return NextResponse.json({ error: "Faculty ID is required" }, { status: 400 });
        }

        const res = await prisma.faculty.delete({
            where: {
                id: Number(facultyId),
            },
        });

        return NextResponse.json({ msg: "Faculty entry deleted successfully" }, { status: 200 });

    } catch (error: any) {

        if (error.code === "P2025") {
            return NextResponse.json({ error: "Faculty with this id does not exists" }, { status: 404 });
        }
        console.log(error);

        return NextResponse.json({ error: "Error deleting Faculty entry" }, { status: 500 });
    }
}