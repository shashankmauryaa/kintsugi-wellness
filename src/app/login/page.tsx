"use client";

import { useState, Suspense } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createSession } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isTherapistSignup, setIsTherapistSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = "/clients";

  const handleAuthSuccess = async (idToken: string) => {
    const result = await createSession(idToken, isSignUp ? isTherapistSignup : false);
    if (result.success) {
      const finalRedirectPath = result.userType === "therapist" ? "/therapists" : "/clients";
      let targetPath = searchParams.get("redirect") || finalRedirectPath;
      
      // If they are a therapist and the original redirect was to a client route, force them to the therapist dashboard
      if (result.userType === "therapist" && targetPath.startsWith("/clients")) {
        targetPath = "/therapists";
      }
      
      // Refresh the router to apply middleware and server component state
      router.push(targetPath);
      router.refresh();
    } else {
      setError("Failed to create secure session.");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const idToken = await userCredential.user.getIdToken();
      await handleAuthSuccess(idToken);
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      await handleAuthSuccess(idToken);
    } catch (err: any) {
      setError(err.message || "Google authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gold-200)]"
      >
        <h1 className="text-3xl font-heading text-[var(--color-gold-900)] mb-2 text-center">
          {isSignUp ? (isTherapistSignup ? "Apply as a Therapist" : "Create an Account") : "Welcome Back"}
        </h1>
        <p className="text-[var(--color-gold-700)] text-center mb-8">
          {isSignUp ? (isTherapistSignup ? "Join our network of professionals" : "Begin your journey with Kintsugi Wellness") : "Log in to access your portal"}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-shadow"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-400)] transition-shadow"
              placeholder="••••••••"
            />
          </div>



          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-gold-700)] hover:bg-[var(--color-gold-800)] text-white rounded-xl font-medium transition-colors disabled:opacity-70"
          >
            {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Log In")}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-gold-200)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-[var(--color-gold-600)]">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 bg-white border border-[var(--color-gold-300)] hover:bg-[var(--color-gold-50)] text-[var(--color-gold-900)] rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="mt-8 flex flex-col gap-3 text-center text-sm text-[var(--color-gold-700)]">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => { setIsSignUp(false); setIsTherapistSignup(false); }} 
                className="text-[var(--color-gold-900)] font-medium hover:underline"
              >
                Log In
              </button>
            </p>
          ) : (
            <>
              <p>
                Don't have an account?{" "}
                <button 
                  onClick={() => { setIsSignUp(true); setIsTherapistSignup(false); }} 
                  className="text-[var(--color-gold-900)] font-medium hover:underline"
                >
                  Sign Up
                </button>
              </p>
              <p>
                <button 
                  onClick={() => { setIsSignUp(true); setIsTherapistSignup(true); }} 
                  className="text-[var(--color-gold-900)] font-medium hover:underline"
                >
                  Sign up as a therapist
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[var(--color-gold-700)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
