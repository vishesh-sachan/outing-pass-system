"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import Image from "next/image";
import StudentNavbar from "@/components/StudentNavbar";
import { useRouter } from "next/navigation";

interface Pass {
    id: number;
    studentId: number;
    reason: string;
    encryptionKey: string;
    status: "pending" | "approved" | "rejected" | "closed";
    startTime: string;
    endTime: string;
    actualstartTime: string | null;
    actualendTime: string | null;
    createdAt: string;
}

export default function ApplyPass() {
    const { data: session, status:sessionStatus } = useSession();
    const studentId = (session?.user as { id: number })?.id;
    const role = (session?.user as { role: string })?.role;
    const router = useRouter();
    const [hasActivePass, setHasActivePass] = useState(0); // 0 = loading, 1 = active pass, 2 = no active pass
    const [pass, setPass] = useState<Pass | null>(null);
    const [reason, setReason] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [date, setDate] = useState("");
    const [dateError, setDateError] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || '';

    const generateQrCode = async () => {
        if (!pass) return;
        const qrData = {
            id: pass.id.toString(),
            studentId: studentId.toString(),
            reason: pass.reason,
        };
        try {
            const options: QRCodeToDataURLOptions = {
                errorCorrectionLevel: "high",
            };
            const url = await QRCode.toDataURL(JSON.stringify(qrData), options);
            setQrCodeUrl(url);
        } catch (err) {
            console.error("Failed to generate QR code", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const currentDate = new Date();
        const selectedDate = new Date(date);
        const startDateTime = `${date} ${startTime}:00`;
        const endDateTime = `${date} ${endTime}:00`;

        if (
            selectedDate.toDateString() === currentDate.toDateString() ||
            selectedDate.toDateString() ===
            new Date(currentDate.setDate(currentDate.getDate() + 1)).toDateString()
        ) {
            setDateError("");
        } else {
            setDateError("Date must be today or the next day");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/pass", {
                studentId,
                reason,
                startTime: startDateTime,
                endTime: endDateTime,
            });

            if (res.status === 201) {
                const newPass = res.data;
                setPass(newPass);
                setHasActivePass(1);

                const socket = new WebSocket(socketUrl);
                
                socket.onopen = () => {
                    socket.send(
                        JSON.stringify({
                            isStudent: true,
                            passId: newPass.id,
                            studentId,
                        })
                    );
                };
                socket.onerror = (error) => {
                    console.error("WebSocket connection error:", error);
                    setError("Error in WebSocket connection");
                };

                alert("Pass applied successfully.");
                window.location.reload();
            }
        } catch (err) {
            console.error("Error creating pass request:", err);
            setError("An error occurred while creating the pass request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionStatus !== 'loading') {
            setLoading(false);
        }
    }, [sessionStatus]);

    useEffect(() => {
        const getActivePass = async () => {
            if (!studentId) return;

            setLoading(true);
            try {
                const res = await axios.get(`/api/pass?studentId=${studentId}`);
                const passes: Pass[] = Array.isArray(res.data) ? res.data : [];

                const activePass = passes.find(
                    (p) => p.status === "pending" || p.status === "approved"
                );

                if (activePass) {
                    setPass(activePass);
                    setHasActivePass(1);
                } else {
                    setHasActivePass(2);
                }
            } catch (err) {
                console.error("Error fetching active passes:", err);
                setError("Failed to load passes.");
                setHasActivePass(2);
            } finally {
                setLoading(false);
            }
        };

        getActivePass();
    }, [studentId]);

    useEffect(() => {
        if (hasActivePass === 1 && pass?.status === "approved") {
            generateQrCode();
        }
    }, [hasActivePass, pass]);

    useEffect(() => {
        if (hasActivePass === 1 && pass?.status === "pending") {
            try {
                const socket = new WebSocket(socketUrl);

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

    if (loading) return <div className="p-6 flex justify-center items-center"> <div>Loading...</div></div>;

    if (error) return <div className="text-red-500">Error: {error}</div>;

    if (!session) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <p className="text-2xl mb-8 text-red-500">You are not signed in. Please sign in to access this page.</p>
            <div className="space-x-4">
              <button 
                onClick={() => router.push('/api/auth/signin')} 
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                SignIn
              </button>
            </div>
          </div>
        );
    }

    if (role) {
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

    if (hasActivePass === 1) {
        if (pass?.status === "pending") {
            return (
                <div>
                    <StudentNavbar />
                    <div key={pass.id} className="mb-4 p-4 border rounded-lg bg-white">
                        <p className="text-lg font-bold mb-2">{pass.reason}</p>
                        <div className="flex items-center mb-2">
                            <span
                                className={`inline-block w-3 h-3 rounded-full mr-2 ${pass.status === "pending" ? "bg-yellow-500" : "bg-black"
                                    }`}
                            ></span>
                            <p className="text-sm font-medium">{pass.status}</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                            <strong>Created At:</strong> {new Date(pass.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            );
        }

        if (pass?.status === "approved") {
            return (
                <div>
                    <StudentNavbar />
                    <div> Your Pass is Approved </div>
                    <div>
                        <Image
                            src={qrCodeUrl}
                            alt="Generated QR Code"
                            width={200}
                            height={200}
                        />
                    </div>
                </div>
            );
        }
    }

    if (hasActivePass === 2) {
        return (
            <div>
                <StudentNavbar />
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
                                    maxLength={100}
                                    required
                                    className="mt-1 p-2 w-full border rounded"
                                />
                                <p className="text-gray-500 text-sm mt-1">{reason.length}/100</p>
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
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {loading ? "Submitting..." : "Apply"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}