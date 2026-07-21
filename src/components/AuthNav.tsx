"use client";

import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { removeSession } from "@/actions/auth";
import { useRouter, usePathname } from "next/navigation";

export default function AuthNav() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await removeSession();
    } catch (e) {
      console.error("Failed to remove session cookie", e);
    }
    try {
      await auth.signOut();
    } catch (e) {
      console.error("Failed to sign out from Firebase", e);
    }
    window.location.href = "/login";
  };

  const isDashboardPage = pathname?.startsWith("/clients") || pathname?.startsWith("/therapists");

  return (
    <div className="relative flex items-center justify-end z-50">
      {isDashboardPage ? (
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-[var(--color-gold-600)] hover:bg-[var(--color-gold-700)] text-white w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm relative z-20"
          aria-label="User Menu"
        >
          <User size={20} />
        </button>
      ) : (
        <a href="/dashboard" className="bg-[var(--color-gold-600)] hover:bg-[var(--color-gold-700)] text-white w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm relative z-20" aria-label="Portal">
          <User size={20} />
        </a>
      )}

      {isDashboardPage && isLoggedIn && (
        <div 
          className={`absolute transition-all duration-300 ease-in-out z-10 ${
            isDropdownOpen ? 'opacity-100 -translate-x-12 pointer-events-auto' : 'opacity-0 translate-x-0 pointer-events-none'
          }`}
        >
          <button 
            onClick={handleLogout}
            className="bg-white border border-[var(--color-gold-200)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[var(--color-gold-800)] w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-md"
            aria-label="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
