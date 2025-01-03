"use client"

import axios from "axios"
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

export default function PassStudentInfoCard(studentId: { studentId: number }) {
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)

    useEffect(() => {
        async function getData() {
            if (studentId) {
                try {
                   
                    const res = await axios.get(`/api/student?studentId=${studentId.studentId}`)
                    setStudentInfo(res.data)
                } catch (error) {
                    console.error('Error fetching student data:', error)
                }
            }
        }

        getData()
    }, [studentId])

    return (
        <div>
            {studentInfo && (
                <div>
                    <p><strong>Student Name:</strong> {studentInfo.name}</p>
                    <p><strong>Room No:</strong> {studentInfo.allotedRoomNo}</p>
                    <p><strong>Course:</strong> {studentInfo.course}</p>
                    <p><strong>Year:</strong> {studentInfo.year}</p>
                    <p><strong>Personal Phone Number:</strong> {studentInfo.personalPhoneNumber}</p>
                    <p><strong>Father's Phone Number:</strong> {studentInfo.fathersPhoneNumber}</p>
                    <p><strong>Hostel:</strong> {studentInfo.hostel}</p>
                </div>
            )}      
        </div>
    )
}