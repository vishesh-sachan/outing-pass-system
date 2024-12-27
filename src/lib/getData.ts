import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getStudentByEmail(email: string) {
    const user = await prisma.student.findUnique({
        where: { email },
    });
    return user;
}
export async function getFacultyByEmail(email: string) {
    const user = await prisma.faculty.findUnique({
        where: { email },
    });
    return user;
}