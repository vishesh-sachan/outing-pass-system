"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface StudentInfo {
    name: string;
    email: string;
    fathersName: string;
    mothersName: string;
    course: string;
    branch: string;
    year: string;
    permanentAddress: string;
    localGaurdiansName: string;
    localGaurdiansAddress: string;
    personalPhoneNumber: string;
    fathersPhoneNumber: string;
    mothersPhoneNumber: string;
    localGaurdianPhoneNumber: string;
    allotedRoomNo: string;
    hostel: string;
    dateOfJoining: string;
}

export default function StudentInfoCard() {
    const { data: session, status } = useSession()
    const studentId = (session?.user as { id: number })?.id;
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            if (studentId) {
                try {
                    setIsLoading(true)
                    const res = await axios.get(`/api/student?studentId=${studentId}`)
                    setStudentInfo(res.data)
                } catch (error) {
                    console.error('Error fetching student data:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        getData()
    }, [studentId])

    if (status === "loading" || isLoading) {
        return <div className="p-4 text-center">Loading...</div>
    }

    return (
        <div>
            <div className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-3xl font-semibold mb-4">Personal Information</h3>
                        {studentInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Name:</strong> {studentInfo.name}</p>
                                <p><strong>Email:</strong> {studentInfo.email}</p>
                                <p><strong>Father's Name:</strong> {studentInfo.fathersName}</p>
                                <p><strong>Mother's Name:</strong> {studentInfo.mothersName}</p>
                                <p><strong>Course:</strong> {studentInfo.course}</p>
                                <p><strong>Branch:</strong> {studentInfo.branch}</p>
                                <p><strong>Year:</strong> {studentInfo.year}</p>
                                <p><strong>Permanent Address:</strong> {studentInfo.permanentAddress}</p>
                                <p><strong>Local Guardian's Name:</strong> {studentInfo.localGaurdiansName}</p>
                                <p><strong>Local Guardian's Address:</strong> {studentInfo.localGaurdiansAddress}</p>
                                <p><strong>Personal Phone Number:</strong> {studentInfo.personalPhoneNumber}</p>
                                <p><strong>Father's Phone Number:</strong> {studentInfo.fathersPhoneNumber}</p>
                                <p><strong>Mother's Phone Number:</strong> {studentInfo.mothersPhoneNumber}</p>
                                <p><strong>Local Guardian's Phone Number:</strong> {studentInfo.localGaurdianPhoneNumber}</p>
                                <p><strong>Alloted Room No:</strong> {studentInfo.allotedRoomNo}</p>
                                <p><strong>Hostel:</strong> {studentInfo.hostel}</p>
                                <p><strong>Date of Joining:</strong> {studentInfo.dateOfJoining}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}