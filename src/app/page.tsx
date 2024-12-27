'use client'
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You are not signed in. Please sign in to access this page.</p>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Your email: {session.user.email}</p>
      <p>Your ID: {session.user.id}</p>
      <p>Your Role: {session.user.role}</p>
    </div>
  );
}