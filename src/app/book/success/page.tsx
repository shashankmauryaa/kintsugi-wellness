"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyAndCreateBooking } from "@/actions/booking";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const serviceId = searchParams.get("serviceId");
  const startTime = searchParams.get("startTime");
  const amount = searchParams.get("amount");
  const mock = searchParams.get("mock");
  const mode = searchParams.get("mode");
  const offlineLocation = searchParams.get("offlineLocation");
  
  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
  const razorpay_payment_link_id = searchParams.get("razorpay_payment_link_id");
  const razorpay_payment_link_status = searchParams.get("razorpay_payment_link_status");
  const razorpay_signature = searchParams.get("razorpay_signature");

  useEffect(() => {
    // Prevent double verification in React Strict Mode
    let mounted = true;

    async function verifyPayment() {
      if (!startTime || !serviceId) {
        if (mounted) {
          setStatus("error");
          setErrorMsg("Missing booking details in URL.");
        }
        return;
      }

      // If already processed in this session (simple local check)
      const key = `booking_processed_${startTime}`;
      if (sessionStorage.getItem(key)) {
        if (mounted) setStatus("success");
        return;
      }

      try {
        const verifyRes = await verifyAndCreateBooking({
          razorpay_payment_id,
          razorpay_payment_link_id,
          razorpay_payment_link_status,
          razorpay_signature,
          isMock: mock === "true"
        }, {
          serviceId,
          startTime,
          amount: parseInt(amount || "0"),
          duration: serviceId === "listening" ? 30 : 60,
          mode: mode || "online",
          offlineLocation: offlineLocation || "christ"
        });

        if (verifyRes.success) {
          sessionStorage.setItem(key, "true");
          if (mounted) setStatus("success");
        } else {
          if (mounted) {
            setStatus("error");
            setErrorMsg(verifyRes.error || "Payment verification failed.");
          }
        }
      } catch (err: any) {
        if (mounted) {
          setStatus("error");
          setErrorMsg(err.message || "An unexpected error occurred.");
        }
      }
    }

    verifyPayment();

    return () => { mounted = false; };
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-gold-900)]">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-[var(--color-gold-600)]" />
        <h2 className="text-2xl font-heading mb-2">Confirming your booking...</h2>
        <p className="text-[var(--color-gold-800)]">Please do not close this window. We are securing your time slot.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <XCircle size={40} />
        </div>
        <h2 className="text-3xl font-heading text-[var(--color-gold-900)] mb-4">Verification Failed</h2>
        <p className="text-red-600 mb-8 max-w-md mx-auto">{errorMsg}</p>
        <p className="text-[var(--color-gold-800)] mb-8 max-w-md mx-auto">
          If you have been charged, please contact Khushi directly and your booking will be manually confirmed.
        </p>
        <Link href="/book" className="px-8 py-3 bg-[var(--color-gold-700)] text-white rounded-full font-medium hover:bg-[var(--color-gold-800)] transition-colors">
          Return to Booking
        </Link>
      </div>
    );
  }

  const duration = serviceId === "listening" ? 30 : 60;
  
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={40} />
      </div>
      <h2 className="text-3xl font-heading text-[var(--color-gold-900)] mb-4">Booking Confirmed!</h2>
      <p className="text-[var(--color-gold-800)] mb-8 max-w-md mx-auto">
        Your session for {format(new Date(startTime!), "MMMM d, yyyy 'at' h:mm a")} to {format(new Date(new Date(startTime!).getTime() + duration * 60000), "h:mm a")} has been successfully booked. You will receive a calendar invite shortly.
      </p>
      <Link href="/portal" className="px-8 py-3 bg-[var(--color-gold-700)] text-white rounded-full font-medium hover:bg-[var(--color-gold-800)] transition-colors">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gold-50)] pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-[var(--color-gold-200)]/50 shadow-sm">
        <Suspense fallback={
          <div className="flex flex-col items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold-600)]" /></div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
