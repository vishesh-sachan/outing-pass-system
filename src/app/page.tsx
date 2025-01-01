'use client'
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const role = (session?.user as { role: string })?.role;
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-center">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Outing Pass System</h1>
        <p className="text-xl mb-8">A Pass generation system for hostel students</p>
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

  if (session && !role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Outing Pass System</h1>
        <p className="text-xl mb-8">A Pass generation system for hostel students</p>
        <div className="space-x-4">
          <button 
            onClick={() => router.push('/student')} 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Student Dashboard
          </button>
          <button 
            onClick={() => signOut()} 
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }else if(session && (role === "warden" || role === "admin")){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Outing Pass System</h1>
        <p className="text-xl mb-8">A Pass generation system for hostel students</p>
        <div className="space-x-4">
          <button 
            onClick={() => router.push('/faculty')} 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Faculty Dashboard
          </button>
          <button 
            onClick={() => signOut()} 
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }else{
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Outing Pass System</h1>
        <p className="text-xl mb-8">A Pass generation system for hostel students</p>
        <div className="space-x-4">
          <button 
            onClick={() => router.push('/gaurd')} 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Gaurd's Page
          </button>
          <button 
            onClick={() => signOut()} 
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }
}