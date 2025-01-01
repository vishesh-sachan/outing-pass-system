'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import FacultyNavbar from '@/components/FacultyNavbar';
import { useRouter } from 'next/navigation';

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

async function updateStatus(passId:number,status:string) {
    // console.log(`pass id ${passId} , status ${status}`)
    try {
      const res = await axios.put('/api/pass',{
        passId,
        status
      })
      // console.log(res);
      return res;
      
    } catch (error) {
      console.log(error);
    }
  }

export default function PassReq() {

    const { data: session, status: sessionStatus } = useSession()
    const role = (session?.user as { role: string })?.role;
    const router = useRouter();
    const [passes, setPasses] = useState<Pass[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || '';
    
    useEffect(() => {
        if (sessionStatus !== 'loading') {
            setIsLoading(false);
        }
    }, [sessionStatus]);


    async function handleAction(id: number, studentId: number, action: string) {
        const status = action.toString()
        updateStatus(id, status).then(res => {
            if (res && res.status === 200) {
                try {
                    const socket = new WebSocket(socketUrl);
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
            }}).catch(error => {
                console.log('Failed to update status:', error)
            });
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
                const socket = new WebSocket(socketUrl);
                
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
        
    if (sessionStatus === 'loading' || isLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div>Loading...</div>
            </div>
        )
    }
    
    if (role && (role === "warden" || role === "admin")) {
        return (
            <div>
                <FacultyNavbar />
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Pending Passes</h1>
                    <ul className="space-y-4">
                        {passes.map((pass) => (
                            <li key={pass.id} className="border p-4 rounded">
                                <p>Student: {pass.studentId}</p>
                                <p>Reason: {pass.reason}</p>
                                <div className="mt-2 space-x-2">
                                    <button
                                        onClick={() => handleAction(pass.id, pass.studentId, "approved")}
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
            </div>
        );  
    }
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