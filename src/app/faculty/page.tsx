'use client'
import FacultyInfoCard from "@/components/FacultyInfoCard"
import FacultyNavbar from "@/components/FacultyNavbar"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Faculty() {
    const { data: session, status: sessionStatus } = useSession()
    const role = (session?.user as { role: string })?.role;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (sessionStatus !== 'loading') {
            setIsLoading(false);
        }
    }, [sessionStatus]);

    if (sessionStatus === 'loading' || isLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div>Loading...</div>
            </div>
        )
    }

    if (role && (role === "warden" || role === "admin")) {
        return (
            <div>
                <FacultyNavbar />
                <FacultyInfoCard />
            </div>
        )
    }
    return (
        <div className="p-6 flex justify-center items-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
                <p className="text-gray-600">You do not have the necessary permissions to view this page.</p>
                <button
                        onClick={() => router.push('/')}
                        className="bg-blue-500 text-white px-6 py-2 my-6 rounded hover:bg-blue-600 transition"
                    >
                        Go Back Home Page
                    </button>
            </div>
        </div>
    )
}