"use client";

import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { removeSession } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await removeSession();
    await auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <a href="/portal" className="bg-[var(--color-gold-600)] hover:bg-[var(--color-gold-700)] text-white w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm" aria-label="Client Portal">
        <User size={20} />
      </a>
      {isLoggedIn && (
        <button 
          onClick={handleLogout}
          className="bg-white border border-[var(--color-gold-200)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[var(--color-gold-800)] w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm"
          aria-label="Log Out"
        >
          <LogOut size={20} />
        </button>
      )}
    </div>
  );
}
