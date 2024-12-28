'use client'

import { signOut } from "next-auth/react"

export default function StudentNavbar() {
    return (
        <div>
            <nav className="bg-blue-500 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-white text-lg font-bold">Outing Pass System</div>
                    <div className="flex space-x-4">
                        <a href="/student" className="text-white hover:underline">Dashboard</a>
                        <a href="/applypass" className="text-white hover:underline">Apply for Pass</a>
                        <button className="text-white hover:underline" onClick={()=>{signOut()}}>Logout</button>
                    </div>
                </div>
            </nav>

        </div>
    )
}

