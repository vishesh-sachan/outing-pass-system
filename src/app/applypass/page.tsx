"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Pass {
    id: number
    studentId: number
    reason: string
    status: 'pending' | 'approved' | 'rejected' | 'closed'
    startTime: string
    endTime: string
    actualStartTime: string | null
    actualEndTime: string | null
    createdAt: string
}


export default function ApplyPass() {

    const { data: session, status } = useSession()
    const studentId = session?.user?.id;
    const [hasActivePass, setHasActivePass] = useState(0);
    const [pass, setPass] = useState<Pass>()
    const [reason, setReason] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const currentDate = new Date();
        const selectedDate = new Date(date);
        const startDateTime = `${date} ${startTime}:00`;
        const endDateTime = `${date} ${endTime}:00`;
        if (
            selectedDate.toDateString() === currentDate.toDateString() ||
            selectedDate.toDateString() === new Date(currentDate.setDate(currentDate.getDate() + 1)).toDateString()
        ) {
            setDateError('');
        } else {
            setDateError('Date must be today or the next day');
        }
        try {
            const res = await axios.post('api/pass', { studentId, reason, startTime: startDateTime, endTime: endDateTime })
            if (res.status === 201) {
                //web socket call
                try {
                    const socket = new WebSocket('ws://localhost:8080');
                    socket.onopen = () => {
                        socket.send(JSON.stringify({ isStudent: true, passId: res.data.id, studentId }));
                    };
                    socket.onerror = (error) => {
                        console.log("Error in WebSocket connection:", error);
                        setDateError('Error in WebSocket connection');
                    };
                } catch(e) {
                    // console.log("Error in WebSocket:", e);
                    setDateError('Error in WebSocket connection');
                }
                alert("Pass applied successfully.");
                
                window.location.reload();
                
                setDateError('');

            }
        } catch (e) {
            console.log(e)
            setDateError('Error occured while creating pass request, Please try again');

        }
    };

    useEffect(() => {
        console.log("use efect called for pass statuses pending || approved ")
        async function getActivePass() {
            if (session?.user?.id) {

                const res = await axios.get(`/api/pass?studentId=${session?.user?.id}`)
                
                if( res.data.length === 0){
                    setHasActivePass(2);
                }
                res.data.map((p: Pass) => {
                    if (p.status === "pending" || p.status === "approved") {
                        setHasActivePass(1);
                        setPass(p);
                    } else {
                        setHasActivePass(2);
                    }
                })
            }
        }

        getActivePass();

    }, [session?.user?.id])

    useEffect(() => {
        console.log("use effect of ws for lisning ws messages ")
        if (hasActivePass === 1 && pass?.status === "pending") {
            console.log(hasActivePass)
            try {
                const socket = new WebSocket('ws://localhost:8080');
                
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (!data.isStudent && 
                        data.studentId === studentId && 
                        data.passId === pass.id) {
                        alert(`Your pass has been ${data.status}`);
                        window.location.reload();
                    }
                };

                socket.onerror = (error) => {
                    console.log("WebSocket connection error:", error);
                };

                return () => {
                    socket.close();
                };
            } catch (error) {
                console.log("Error setting up WebSocket:", error);
            }
        }
    }, [hasActivePass, pass, studentId]);

    if (hasActivePass === 1 && pass.status === "pending") {
        return (
            <div key={pass.id} className="mb-4 p-4 border rounded-lg bg-white">
                <p className="text-lg font-bold mb-2">{pass.reason}</p>
                <div className="flex items-center mb-2">
                    <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${pass.status === "rejected" ? "bg-red-500" : pass.status === "pending" ? "bg-yellow-500" : pass.status === "approved" ? "bg-green-500" : "bg-black"}`}
                    ></span>
                    <p className="text-sm font-medium">{pass.status}</p>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                    <strong>Created At:</strong> {new Date(pass.createdAt).toLocaleString()}
                </p>
                {pass.status !== "rejected" && (
                    <>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Start Time:</strong> {new Date(pass.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>End Time:</strong> {new Date(pass.endTime).toLocaleString()}
                        </p>
                        {pass.actualStartTime && (
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Actual Start Time:</strong> {new Date(pass.actualStartTime).toLocaleString()}
                            </p>
                        )}
                        {pass.actualEndTime && (
                            <p className="text-sm text-gray-600 mb-1">
                                <strong>Actual End Time:</strong> {new Date(pass.actualEndTime).toLocaleString()}
                            </p>
                        )}
                    </>
                )}
            </div>
        )
    }

    if (hasActivePass === 1 && pass.status === "approved") {
        return (
            <div>
                Your Pass is Approved
                <div>
                    Pass id : {pass.id}
                </div>
            </div>
        )
    }

    if (hasActivePass === 2) {
        return (
            <div>
                <div className="p-4 md:p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
                        <h1 className="text-2xl font-bold mb-4">Apply for Pass</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Reason:</label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Start Time:</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">End Time:</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Date:</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="mt-1 p-2 w-full border rounded"
                                />
                                {dateError && <p className="text-red-500 mt-1">{dateError}</p>}
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Apply</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    } else {
        return <div>Loading....</div>
    }

}