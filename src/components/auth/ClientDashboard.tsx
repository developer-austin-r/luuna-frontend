"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAppDispatch } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/auth-slice";

interface ClientDashboardProps {
  email: string;
}

export function ClientDashboard({ email }: ClientDashboardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d0e12] text-white p-6">
      <div className="max-w-md w-full bg-[#16181f]/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-800 text-center">
        <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Welcome to Luuna
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          You are successfully logged in as a Client.
        </p>
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-semibold">
            Logged In As
          </p>
          <p className="font-semibold text-lg text-gray-200">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 font-semibold transition-all duration-200 border border-red-500/20 cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
