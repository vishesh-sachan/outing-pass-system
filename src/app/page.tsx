'use client'
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  if (!session) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p>You are not signed in. Please sign in to access this page.</p>
        <div>
          <a href="/api/auth/signin">Sign in</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        <a href="/student">Student</a>
      </div>
      <div>
        <a href="/faculty">Faculty</a>
      </div>
      <div>
        <a href="/gaurd">Gaurd</a>
      </div>
    </div>
  );
}