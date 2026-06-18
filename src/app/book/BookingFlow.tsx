"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAndCreateBooking } from "@/actions/booking";
import { Calendar as CalendarIcon, Clock, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SERVICES = [
  { id: "individual", title: "Individual Counselling", price: 1500, duration: 50 },
  { id: "student", title: "Student Counselling", price: 1000, duration: 50 },
  { id: "listening", title: "Listening Space Session", price: 600, duration: 30 },
];

export default function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "individual";

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(SERVICES.find(s => s.id === initialService) || SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<{time: string, label: string}[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch Slots
  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      setError(null);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(`/api/calendar?date=${dateStr}`);
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        setAvailableSlots(data.slots || []);
        setSelectedSlot(null); // Reset selection on date change
      } catch (err: any) {
        setError("Failed to load availability. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    }
    
    fetchSlots();
  }, [selectedDate]);

  const handleDateChange = (daysToAdd: number) => {
    setSelectedDate(addDays(selectedDate, daysToAdd));
  };

  const handlePayment = async () => {
    if (!selectedSlot) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Create Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startTime: selectedSlot,
          amount: selectedService.price,
        }),
      });
      const orderData = await orderRes.json();
      
      if (orderData.error) throw new Error(orderData.error);

      if (orderData.isMock) {
        // Mock success flow if Razorpay isn't configured
        const verifyRes = await verifyAndCreateBooking({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: "mock_payment_id",
          razorpay_signature: "mock_signature",
          isMock: true
        }, {
          serviceId: selectedService.id,
          startTime: selectedSlot,
          amount: selectedService.price
        });
        
        if (verifyRes.success) {
          setStep(3); // Success step
        } else {
          throw new Error(verifyRes.error);
        }
        setProcessing(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: selectedService.price * 100,
        currency: "INR",
        name: "Kintsugi Wellness",
        description: selectedService.title,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await verifyAndCreateBooking({
            ...response,
            isMock: false
          }, {
            serviceId: selectedService.id,
            startTime: selectedSlot,
            amount: selectedService.price
          });

          if (verifyRes.success) {
            setStep(3); // Success step
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#bd7532" // gold-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || "Payment failed");
      });
      rzp.open();
      
    } catch (err: any) {
      setError(err.message || "Failed to process booking");
    } finally {
      setProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-heading text-[var(--color-gold-900)] mb-4">Booking Confirmed!</h2>
        <p className="text-[var(--color-gold-800)] mb-8 max-w-md mx-auto">
          Your session for {format(new Date(selectedSlot!), "MMMM d, yyyy 'at' h:mm a")} has been successfully booked. You will receive a confirmation email shortly.
        </p>
        <button 
          onClick={() => router.push("/portal")}
          className="px-8 py-3 bg-[var(--color-gold-700)] text-white rounded-full font-medium hover:bg-[var(--color-gold-800)]"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-heading text-[var(--color-gold-900)] mb-4">Select Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICES.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-4 rounded-xl border text-left transition-all ${selectedService.id === s.id ? 'border-[var(--color-gold-600)] bg-[var(--color-gold-50)] shadow-sm' : 'border-[var(--color-gold-200)] hover:border-[var(--color-gold-400)]'}`}
                >
                  <div className="font-medium text-[var(--color-gold-900)] mb-1">{s.title}</div>
                  <div className="text-sm text-[var(--color-gold-600)]">₹{s.price} • {s.duration} mins</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-2">
              <CalendarIcon className="text-[var(--color-gold-500)]" size={20} /> Select Date & Time
            </h3>
            
            <div className="flex items-center justify-between mb-6 bg-[var(--color-gold-50)] p-2 rounded-xl">
              <button onClick={() => handleDateChange(-1)} disabled={selectedDate <= startOfToday()} className="p-2 rounded-lg hover:bg-white disabled:opacity-50 text-[var(--color-gold-800)]">
                Prev
              </button>
              <div className="font-medium text-[var(--color-gold-900)]">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </div>
              <button onClick={() => handleDateChange(1)} className="p-2 rounded-lg hover:bg-white text-[var(--color-gold-800)]">
                Next
              </button>
            </div>

            {loadingSlots ? (
              <div className="py-12 text-center text-[var(--color-gold-600)]">Loading availability...</div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {availableSlots.map(slot => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot.time ? 'border-[var(--color-gold-600)] bg-[var(--color-gold-600)] text-white' : 'border-[var(--color-gold-200)] text-[var(--color-gold-800)] hover:border-[var(--color-gold-400)] hover:bg-[var(--color-gold-50)]'}`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[var(--color-gold-600)] bg-[var(--color-gold-50)] rounded-2xl border border-dashed border-[var(--color-gold-200)]">
                No available slots for this date.
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-[var(--color-gold-200)]">
            <button 
              onClick={() => setStep(2)}
              disabled={!selectedSlot}
              className="px-8 py-3 bg-[var(--color-gold-700)] text-white rounded-full font-medium disabled:opacity-50 hover:bg-[var(--color-gold-800)] transition-colors flex items-center gap-2"
            >
              Continue to Payment <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div className="bg-[var(--color-gold-50)] p-6 rounded-2xl border border-[var(--color-gold-200)]">
            <h3 className="text-lg font-heading text-[var(--color-gold-900)] mb-4">Booking Summary</h3>
            <div className="space-y-3 text-[var(--color-gold-800)]">
              <div className="flex justify-between border-b border-[var(--color-gold-200)] pb-3">
                <span>Service</span>
                <span className="font-medium text-[var(--color-gold-900)]">{selectedService.title}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-gold-200)] pb-3">
                <span>Date & Time</span>
                <span className="font-medium text-[var(--color-gold-900)]">{selectedSlot && format(new Date(selectedSlot), "MMM d, yyyy - h:mm a")}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-medium text-lg">Total Amount</span>
                <span className="font-medium text-lg text-[var(--color-gold-900)]">₹{selectedService.price}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button 
              onClick={() => setStep(1)}
              disabled={processing}
              className="px-6 py-2 border border-[var(--color-gold-300)] text-[var(--color-gold-800)] rounded-full font-medium hover:bg-[var(--color-gold-50)]"
            >
              Back
            </button>
            <button 
              onClick={handlePayment}
              disabled={processing}
              className="px-8 py-3 bg-[var(--color-gold-700)] text-white rounded-full font-medium hover:bg-[var(--color-gold-800)] flex items-center gap-2"
            >
              {processing ? "Processing..." : (
                <>Pay ₹{selectedService.price} Securely <CreditCard size={18} /></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
