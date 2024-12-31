'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Pass {
    id: number
    studentId: number
    reason: string
    status: 'pending' | 'approved' | 'rejected' | 'closed'
    startTime: string
    endTime: string
    actualstartTime: string | null
    actualendTime: string | null
    createdAt: string
}

export default function PendingPasses() {

    const [passes, setPasses] = useState<Pass[]>([]);

    async function handleAction(id: number, studentId: number, action: string) {
        try {
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => {
                socket.send(JSON.stringify({ isStudent: false, passId: id, studentId, status: action }));
            };
            socket.onerror = (error) => {
                console.log("Error in WebSocket connection:", error);
            };
            updatePasses(id,"remove");
            console.log(`pass with if ${id} is ${action}`)
        } catch (error) {
            console.error('Error processing pass:', error);
        }
    }

    function updatePasses(passId: number, action: 'add' | 'remove', newPass?: Pass) {
        if (action === 'add' && newPass) {
            setPasses(prevPasses => [...prevPasses, newPass]);
        } else if (action === 'remove' && passId) {
            setPasses(prevPasses => prevPasses.filter(pass => pass.id !== passId));
        }
    }

    async function getPassById(passId:number){
        try {
            const res = await axios.get(`/api/passwithid?id=${passId}`)
            updatePasses(passId,"add",res.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function getPasses() {
            const res = await axios.get('/api/pendingpass')
            setPasses(res.data);
        }
        getPasses();
    }, [])

    useEffect(() => {
            try {
                const socket = new WebSocket('ws://localhost:8080');
    
                socket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.isStudent) {
                        getPassById(data.passId);
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

    }, []);


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Pending Passes</h1>
            <ul className="space-y-4">
                {passes.map((pass) => (
                    <li key={pass.id} className="border p-4 rounded">
                        <p>Student: {pass.studentId}</p>
                        <p>Reason: {pass.reason}</p>
                        <div className="mt-2 space-x-2">
                            <button
                                onClick={() => handleAction(pass.id, pass.studentId, 'approved')}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleAction(pass.id, pass.studentId, 'rejected')}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}