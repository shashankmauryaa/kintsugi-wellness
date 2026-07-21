"use client";

import { LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { removeSession } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await removeSession();
    await auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 px-4 py-3 text-[var(--color-gold-800)] hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors disabled:opacity-50"
    >
      <LogOut size={20} /> {loading ? "Logging Out..." : "Log Out"}
    </button>
  );
}
