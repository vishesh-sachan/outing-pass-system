'use client'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import bcrypt from 'bcryptjs';
import axios from 'axios'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CheckInNcheckOut from '@/components/CheckInNcheckOut';
import GuardNavbar from '@/components/GuardNavbar';

type ScanResult = {
    decodedText: {
        id: string,
        studentId: string,
        reason: string
    }
    result: any
}

interface Pass {
    id: number
    studentId: number
    reason: string
    encryptionKey: string
    status: 'pending' | 'approved' | 'rejected' | 'closed'
    startTime: string
    endTime: string
    actualstartTime: string | null
    actualendTime: string | null
    createdAt: string
}

export default function Guard() {
    const [scanning, setScanning] = useState(false)
    const [mode, setMode] = useState<'entry' | 'exit' | null>(null)
    const [scannedData, setScannedData] = useState<ScanResult | null>(null)
    const [updating, setUpdating] = useState(false)
    const { data: session, status: sessionStatus } = useSession()
    const role = (session?.user as { role: string })?.role;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)



    const startScanning = (scanMode: 'entry' | 'exit') => {
        setMode(scanMode)
        setScanning(true)
    }

    useEffect(() => {
        if (sessionStatus !== 'loading') {
            setIsLoading(false);
        }
    }, [sessionStatus]);

    useEffect(() => {
        if (scanning) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 450,
                    height: 450,
                },
                fps: 5,
            }, false)

            scanner.render((decodedText: string, result: any) => {
                const parsedText = JSON.parse(decodedText);
                setScannedData({ decodedText: parsedText, result })
                setScanning(false)
            }, () => {
                // console.warn('Scan error')
            })

            return () => {
                scanner.clear()
            }
        }
    }, [scanning])

    useEffect(() => {
        const processScan = async () => {
            if (scannedData) {
                try {
                    setUpdating(true)
                    const passResponse = await axios.get(`/api/passwithid?id=${scannedData.decodedText.id}`)

                    if (passResponse.data === null) {
                        alert('No pass exists. This is a fake pass.')
                        setMode(null)
                        setUpdating(false)
                        return
                    }

                    const pass: Pass = passResponse.data
                    // console.log(pass)
                    const saltRounds = 10;
                    const value = `${scannedData.decodedText.studentId}${scannedData.decodedText.reason}`;
                    // const encryptionKey = await bcrypt.hash(value, saltRounds);
                    const isLegit = await bcrypt.compare(value, pass.encryptionKey)

                    if (pass.status != "approved") {
                        alert('Pass is Not Approved. Fake Pass')
                        setMode(null)
                        setUpdating(false)
                        return

                    }

                    if (!isLegit) {
                        alert('Fake Pass !!')
                        setMode(null)
                        setUpdating(false)
                        return

                    }

                    if (mode === 'exit') {
                        if (pass.actualstartTime != null) {
                            alert('Student is already out with this pass.')
                            setMode(null)
                            setUpdating(false)
                            return
                        }
                    } else if (mode === 'entry') {
                        if (pass.actualendTime != null) {
                            alert('Student has already returned with this pass.')
                            setMode(null)
                            setUpdating(false)
                            return
                        }
                    }

                    const endpoint = '/api/entryexit'

                    const response = await axios.put(endpoint, {
                        passId: scannedData.decodedText.id,
                        mode
                    })
                    // console.log(response)
                    if (response.status === 200) {
                        if (mode === "exit") {
                            const { actualstartTime } = response.data.data;
                            alert(`Student Exited college campus at ${new Date(actualstartTime).toLocaleString()}`)
                        } else {
                            const { actualendTime } = response.data.data;
                            alert(`Student Entered college campus at ${new Date(actualendTime).toLocaleString()}`)
                        }

                    } else if (response.status === 500) {
                        alert('Entry failed! Try Again')
                    }

                    // alert('Success!')
                    setMode(null)
                } catch (error) {
                    alert('Error processing scan')
                    console.error(error)
                } finally {
                    setUpdating(false)
                }
            }
        }

        processScan()
    }, [scannedData])

    if (sessionStatus === 'loading' || isLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div>Loading...</div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <p className="text-xl md:text-2xl mb-8 text-red-500 text-center">You are not signed in. Please sign in to access this page.</p>
                <div className="space-y-4 md:space-x-4">
                    <button
                        onClick={() => router.push('/api/auth/signin')}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition w-full md:w-auto"
                    >
                        SignIn
                    </button>
                </div>
            </div>
        );
    }

    if (!role || (role && role == "warden")) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
                    <p className="text-gray-600">You do not have the necessary permissions to view this page.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-500 text-white px-6 py-2 my-6 rounded hover:bg-blue-600 transition w-full sm:w-auto"
                    >
                        Go Back Home Page
                    </button>
                </div>
            </div>
        )
    }

    if (scanning) {
        return (
            <div className="container mx-auto p-4">
                <div id="reader"></div>
                <button
                    onClick={() => setScanning(false)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 flex flex-col gap-4">
            {updating ? (
                <div className="flex items-center justify-center">
                    <div className="loader"></div>
                    <span className="ml-2">Updating...</span>
                </div>
            ) : (
                <>
                    <GuardNavbar />
                    <button
                        onClick={() => startScanning('entry')}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Check In
                    </button>
                    <button
                        onClick={() => startScanning('exit')}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Check Out
                    </button>
                    <CheckInNcheckOut />
                </>
            )}
        </div>
    )
}