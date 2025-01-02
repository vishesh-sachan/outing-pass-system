"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function StudentNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const getLinkClasses = (path: string) =>
        `px-3 py-2 rounded-md text-sm font-medium ${window.location.pathname === path
            ? "text-white bg-blue-600"
            : "hover:text-white hover:bg-blue-700"
        }`;

    return (
        <nav className="sticky top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="text-lg font-bold">Outing Pass System</div>
                    <div className="hidden md:flex space-x-4">
                        <Link href="/faculty">
                            <p className={getLinkClasses("/faculty")}>Dashboard</p>
                        </Link>
                        <Link href="/passreq">
                            <p className={getLinkClasses("/passreq")}>Pass Requests</p>
                        </Link>
                        <button
                            className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-blue-700"
                            onClick={() => signOut()}
                        >
                            Logout
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden flex flex-col items-left space-y-2 pt-4 pb-4">
                        <Link href="/faculty">
                            <p className={getLinkClasses("/faculty")}>Dashboard</p>
                        </Link>
                        <Link href="/passreq">
                            <p className={getLinkClasses("/passreq")}>Pass Requests</p>
                        </Link>
                        <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-blue-700" onClick={() => signOut()}>
                            Logout
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};