'use client'
import axios from "axios";
import { useEffect, useState } from "react";

export default function PassOverveiw() {
    const [totalPasses, setTotalPasses] = useState(0)
    const [totalPending, setTotalPending] = useState(0)
    const [totalApproved, setTotalApproved] = useState(0)
    const [totalRejected, setTotalRejected] = useState(0)
    const [totalClosed, setTotalClosed] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getApprovedPasses() {
            let passes = 0;
            let pending = 0;
            let approved = 0;
            let rejected = 0;
            let closed = 0;
            try {
                const res = await axios.get('/api/passOverveiw')
                // console.log(res.data)
                res.data.map((p: any) => {
                    passes++;
                    if (p.status === "pending") {
                        pending++;
                    } else if (p.status === "approved") {
                        approved++;
                    } else if (p.status === "rejected") {
                        rejected++;
                    } else {
                        closed++;
                    }
                })
                setTotalPasses(passes);
                setTotalPending(pending);
                setTotalApproved(approved);
                setTotalRejected(rejected);
                setTotalClosed(closed);
                setIsLoading(false);
            } catch (e) {
                console.log(e)
            }
        }
        getApprovedPasses();
    }, [])
    {
        if (isLoading) {
            return <div></div>
        } else {
            return (
                <div>
                    <div className="p-4 md:p-8">
                        <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-3xl font-semibold mb-4">Pass Request Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-md mb-1">Total Pass Requests: <span className="font-semibold">{totalPasses}</span></div>
                                    <div className="text-md mb-1">Approved: <span className="font-semibold">{totalApproved}</span></div>
                                    <div className="text-md">Pending: <span className="font-semibold">{totalPending}</span></div>
                                    <div className="text-md">Rejected: <span className="font-semibold">{totalRejected}</span></div>
                                    <div className="text-md">Closed: <span className="font-semibold">{totalClosed}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}