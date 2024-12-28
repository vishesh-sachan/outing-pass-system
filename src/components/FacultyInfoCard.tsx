"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface FacultyInfoCard {
    id: number;
    name: string;
    email: string;
    fathersnName: string;
    mothersName: string;
    permanentAddress: string;
    personalPhoneNumber: string;
    fathersPhoneNumber: string;
    mothersPhoneNumber: string;
    allotedRoomNo: string;
    allotedHostel: string; 
    dateOfJoining: string;
    role: string;
}

export default function FacultyInfoCard() {
    const { data: session, status } = useSession()
    const [facultyInfo, setFacultyInfo] = useState<FacultyInfoCard | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            if (session?.user?.id) {
                try {
                    setIsLoading(true)
                    const res = await axios.get(`/api/faculty?facultyId=${session.user.id}`)
                    setFacultyInfo(res.data)
                } catch (error) {
                    console.error('Error fetching faculty data:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        getData()
    }, [session?.user?.id])

    if (status === "loading" || isLoading) {
        return <div className="p-4 text-center">Loading...</div>
    }

    return (
        <div>
            <div className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-3xl font-semibold mb-4">Personal Information</h3>
                        {facultyInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Name:</strong> {facultyInfo.name}</p>
                                <p><strong>Email:</strong> {facultyInfo.email}</p>
                                <p><strong>Father's Name:</strong> {facultyInfo.fathersnName}</p>
                                <p><strong>Mother's Name:</strong> {facultyInfo.mothersName}</p>
                                <p><strong>Permanent Address:</strong> {facultyInfo.permanentAddress}</p>
                                <p><strong>Personal Phone Number:</strong> {facultyInfo.personalPhoneNumber}</p>
                                <p><strong>Father's Phone Number:</strong> {facultyInfo.fathersPhoneNumber}</p>
                                <p><strong>Mother's Phone Number:</strong> {facultyInfo.mothersPhoneNumber}</p>
                                <p><strong>Alloted Room No:</strong> {facultyInfo.allotedRoomNo}</p>
                                <p><strong>Hostel:</strong> {facultyInfo.allotedHostel}</p>
                                <p><strong>Date of Joining:</strong> {facultyInfo.dateOfJoining}</p>
                                <p><strong>Role:</strong> {facultyInfo.role}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}