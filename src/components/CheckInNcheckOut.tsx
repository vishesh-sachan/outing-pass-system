'use client'
import axios from "axios";
import { useEffect, useState } from "react";

export default function CheckInNcheckOut() {
    const [totalCheckOuts, setTotalCheckOuts] = useState(0)
    const [totalCheckIns, setTotalCheckIns] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function getApprovedPasses() {
            let checkIns = 0;
            let checkOuts = 0;
            try {
                const res = await axios.get('/api/checkedOutPasses')
                console.log(res.data)
                res.data.map((p: any) => {
                    if (p.status === "closed") {
                        checkOuts++;
                        checkIns++;
                    } else {
                        checkOuts++;
                    }
                })
                setTotalCheckIns(checkIns);
                setTotalCheckOuts(checkOuts);
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
                                <h3 className="text-3xl font-semibold mb-4">Check-In/Check-Out Summary</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-md mb-1">Pending Check-Ins: <span className="font-semibold">{totalCheckOuts - totalCheckIns}</span></div>
                                    <div className="text-md mb-1">Total Check-Outs: <span className="font-semibold">{totalCheckOuts}</span></div>
                                    <div className="text-md">Total Check-Ins: <span className="font-semibold">{totalCheckIns}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}