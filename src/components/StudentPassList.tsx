"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

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

export default function StudentPassList() {
    const { data: session, status: sessionStatus } = useSession()
    const [passes, setPasses] = useState<Pass[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPasses() {
            if (sessionStatus === 'authenticated' && session?.user?.id) {
                try {
                    const response = await fetch(`/api/pass?studentId=${session.user.id}`)
                    const data = await response.json()
                    setPasses(data)
                } catch (error) {
                    console.error('Failed to fetch passes:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        if (sessionStatus !== 'loading') {
            fetchPasses()
        }
    }, [session?.user?.id, sessionStatus])

    if (sessionStatus === 'loading' || isLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div>Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
                <div className="p-6">
                    <h3 className="text-3xl font-semibold mb-4">Passes</h3>
                    {passes.map((pass) => (
                        <div key={pass.id} className="mb-4 p-4 border rounded-lg bg-white">
                            <p className="text-lg font-bold mb-2">{pass.reason}</p>
                            <div className="flex items-center mb-2">
                                <span
                                    className={`inline-block w-3 h-3 rounded-full mr-2 ${pass.status === "rejected"
                                            ? "bg-red-500"
                                            : pass.status === "pending"
                                                ? "bg-yellow-500"
                                                : pass.status === "approved"
                                                    ? "bg-green-500"
                                                    : "bg-black"
                                        }`}
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
                        </div>))}
                </div>
            </div>
        </div>
    )  
}