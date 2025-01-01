import GoogleProvider from "next-auth/providers/google";
import { getFacultyByEmail, getStudentByEmail } from "./getData";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }: any) {
            const email = user.email;

            try {
                const existingStudent = await getStudentByEmail(email);
                const existingFaculty = await getFacultyByEmail(email);

                if (existingStudent) {
                    return true;
                } else if (existingFaculty) {
                    return true;
                } else {
                    return false;
                }

            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async session({ session, token, user }: any) {
            const email = session.user.email;
            const existingStudent = await getStudentByEmail(email);
            const existingFaculty = await getFacultyByEmail(email);

            if (existingStudent) {
                session.user.id = existingStudent.id;
                return session;
            } else if (existingFaculty) {
                session.user.id = existingFaculty.id;
                  session.user.role = existingFaculty.role;
                return session;
            }
        },
        async redirect({ baseUrl }: { baseUrl: string }) {
            return baseUrl;
        }
    }
}