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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Outing Pass System</h1>
        <p className="text-lg md:text-xl mb-8 text-center">A Pass generation system for hostel students</p>
        <p className="text-lg md:text-2xl mb-8 text-red-500 text-center">You are not signed in. Please sign in to access this page.</p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
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

  if (session && !role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Outing Pass System</h1>
        <p className="text-lg md:text-xl mb-8 text-center">A Pass generation system for hostel students</p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => router.push('/student')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition w-full md:w-auto"
          >
            Student Dashboard
          </button>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition w-full md:w-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  } else if (session && (role === "warden" || role === "admin")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Outing Pass System</h1>
        <p className="text-lg md:text-xl mb-8 text-center">A Pass generation system for hostel students</p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => router.push('/faculty')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition w-full md:w-auto"
          >
            Faculty Dashboard
          </button>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition w-full md:w-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center">Outing Pass System</h1>
        <p className="text-lg md:text-xl mb-8 text-center">A Pass generation system for hostel students</p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => router.push('/gaurd')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition w-full md:w-auto"
          >
            Gaurd's Page
          </button>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition w-full md:w-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }
}