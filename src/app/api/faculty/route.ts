import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function validateSession() {
    const session = await getServerSession( authOptions );
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { user } = session;
    if (!user.role) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return null;
}

export async function GET(req: Request) {
    const validationError = await validateSession();
    if (validationError) return validationError;

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("facultyId");
        const facultyId = Number(id);

        if (!facultyId) {
            return NextResponse.json({ error: "FacultyId is required" }, { status: 400 });
        }

        const res = await prisma.faculty.findFirst({
            where: {
                id: facultyId
            }
        });

        if (res === null) {
            return NextResponse.json({ error: "Faculty with this id does not exist" }, { status: 404 });
        }

        return NextResponse.json(res, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const validationError = await validateSession();
    if (validationError) return validationError;

    try {
        const body = await req.json();
        const { name, fathersnName, mothersName, permanentAddress, personalPhoneNumber, fathersPhoneNumber, mothersPhoneNumber, allotedRoomNo, allotedHostel, dateOfJoining, role, email } = body;

        if (!name || !fathersnName || !mothersName || !permanentAddress || !personalPhoneNumber || !fathersPhoneNumber || !mothersPhoneNumber || !allotedRoomNo || !allotedHostel || !dateOfJoining || !role || !email) {
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
                email
            },
            select: {
                id: true
            }
        });

        return NextResponse.json({ id: res.id }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error creating faculty entry" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const validationError = await validateSession();
    if (validationError) return validationError;

    try {
        const body = await req.json();
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
        });

        return NextResponse.json({ msg: "Faculty info updated successfully" }, { status: 200 });

    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Faculty with this id does not exist" }, { status: 404 });
        }

        console.log(error);
        return NextResponse.json({ error: "Error updating data" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const validationError = await validateSession();
    if (validationError) return validationError;

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
            return NextResponse.json({ error: "Faculty with this id does not exist" }, { status: 404 });
        }
        console.log(error);

        return NextResponse.json({ error: "Error deleting Faculty entry" }, { status: 500 });
    }
}