"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyAndCreateBooking } from "@/actions/booking";
import { Calendar as CalendarIcon, Clock, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";



const SERVICES = [
  { id: "individual", title: "Individual Counselling", price: 1500, duration: 60 },
  { id: "student", title: "Student Counselling", price: 1000, duration: 60 },
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
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [offlineLocation, setOfflineLocation] = useState<"christ" | "clinic" | "discuss">("christ");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Fetch Slots
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      setError(null);
      try {
        // Prevent same-day booking for offline sessions
        if (mode === "offline" && isSameDay(selectedDate, startOfToday())) {
          setAvailableSlots([]);
          setSelectedSlot(null);
          setLoadingSlots(false);
          return;
        }

        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(`/api/calendar?date=${dateStr}&duration=${selectedService.duration}`);
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
  }, [selectedDate, selectedService.duration, mode]);

  const handleDateChange = (daysToAdd: number) => {
    setSelectedDate(addDays(selectedDate, daysToAdd));
  };

  const handlePayment = async () => {
    if (!selectedSlot) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Create Payment Link
      const orderRes = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          startTime: selectedSlot,
          amount: selectedService.price,
          title: selectedService.title,
          mode,
          offlineLocation
        }),
      });
      const orderData = await orderRes.json();
      
      if (orderData.error) throw new Error(orderData.error);

      // 2. Redirect to Razorpay's Highly Secure Hosted Checkout
      if (orderData.paymentLink) {
        window.location.href = orderData.paymentLink;
      } else {
        throw new Error("Failed to generate secure payment link.");
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to process booking");
      setProcessing(false); // Only set to false on error, otherwise let the redirect happen
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
          Your session for {format(new Date(selectedSlot!), "MMMM d, yyyy 'at' h:mm a")} to {format(new Date(new Date(selectedSlot!).getTime() + selectedService.duration * 60000), "h:mm a")} has been successfully booked. You will receive a confirmation email shortly.
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
            <div className="p-5 rounded-2xl border border-[var(--color-gold-200)] mb-6 bg-white transition-all shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-medium text-[var(--color-gold-900)] text-lg">Session Mode</h3>
                
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium transition-opacity cursor-pointer text-[var(--color-gold-900)] ${mode === "online" ? "opacity-100" : "opacity-40"}`} onClick={() => setMode("online")}>
                    Online via Google Meet
                  </span>
                  
                  <button
                    onClick={() => setMode(mode === "online" ? "offline" : "online")}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors flex-shrink-0 ${mode === "offline" ? "bg-[var(--color-gold-600)]" : "bg-[var(--color-gold-300)]"}`}
                    aria-label="Toggle offline mode"
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${mode === "offline" ? "translate-x-7" : "translate-x-1"}`}
                    />
                  </button>

                  <span className={`text-sm font-medium transition-opacity cursor-pointer text-[var(--color-gold-900)] ${mode === "offline" ? "opacity-100" : "opacity-40"}`} onClick={() => setMode("offline")}>
                    Offline, In-Person
                  </span>
                </div>
              </div>
              
              {mode === "offline" && (
                <div className="mt-6 pt-5 border-t border-[var(--color-gold-100)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-medium text-[var(--color-gold-900)] text-lg">Select Location</h3>
                  <div className="relative w-full md:w-88">
                    <select 
                      value={offlineLocation}
                      onChange={(e) => setOfflineLocation(e.target.value as any)}
                      className="w-full px-5 py-3 rounded-xl border border-[var(--color-gold-200)] focus:outline-none focus:border-[var(--color-gold-400)] focus:ring-1 focus:ring-[var(--color-gold-400)] transition-all text-[var(--color-gold-900)] bg-white appearance-none text-sm font-medium"
                    >
                      <option value="christ">Christ University, Bengaluru</option>
                      <option value="clinic">At a Clinic</option>
                      <option value="discuss">Discuss Personally</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-gold-800)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="space-y-6">
                {(() => {
                  const morning = availableSlots.filter(s => new Date(s.time).getHours() < 12);
                  const afternoon = availableSlots.filter(s => new Date(s.time).getHours() >= 12 && new Date(s.time).getHours() < 17);
                  const evening = availableSlots.filter(s => new Date(s.time).getHours() >= 17);

                  return (
                    <>
                      {morning.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[var(--color-gold-600)] mb-3">Morning</h4>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {morning.map(slot => (
                              <button
                                key={slot.time}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot.time ? 'border-[var(--color-gold-600)] bg-[var(--color-gold-600)] text-white' : 'border-[var(--color-gold-200)] text-[var(--color-gold-800)] hover:border-[var(--color-gold-400)] hover:bg-[var(--color-gold-50)]'}`}
                              >
                                {slot.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {afternoon.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[var(--color-gold-600)] mb-3">Afternoon</h4>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {afternoon.map(slot => (
                              <button
                                key={slot.time}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot.time ? 'border-[var(--color-gold-600)] bg-[var(--color-gold-600)] text-white' : 'border-[var(--color-gold-200)] text-[var(--color-gold-800)] hover:border-[var(--color-gold-400)] hover:bg-[var(--color-gold-50)]'}`}
                              >
                                {slot.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {evening.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-[var(--color-gold-600)] mb-3">Evening</h4>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {evening.map(slot => (
                              <button
                                key={slot.time}
                                onClick={() => setSelectedSlot(slot.time)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedSlot === slot.time ? 'border-[var(--color-gold-600)] bg-[var(--color-gold-600)] text-white' : 'border-[var(--color-gold-200)] text-[var(--color-gold-800)] hover:border-[var(--color-gold-400)] hover:bg-[var(--color-gold-50)]'}`}
                              >
                                {slot.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="py-12 text-center text-[var(--color-gold-600)] bg-[var(--color-gold-50)] rounded-2xl border border-dashed border-[var(--color-gold-200)]">
                No available slots for this date.
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6 border-t border-[var(--color-gold-200)]">
            <button
              onClick={() => router.push("/portal")}
              className="px-6 py-2 border border-[var(--color-gold-300)] text-[var(--color-gold-800)] rounded-full font-medium hover:bg-[var(--color-gold-50)] transition-colors"
            >
              Back to Dashboard
            </button>
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
                <span className="font-medium text-[var(--color-gold-900)]">
                  {selectedSlot && `${format(new Date(selectedSlot), "MMM d, yyyy - h:mm a")} to ${format(new Date(new Date(selectedSlot).getTime() + selectedService.duration * 60000), "h:mm a")}`}
                </span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-gold-200)] pb-3 pt-2">
                <span>Location</span>
                <span className="font-medium text-[var(--color-gold-900)] text-right">
                  {mode === "online" ? "Online (Google Meet)" : 
                    offlineLocation === "christ" ? "Christ University, Bengaluru" : 
                    offlineLocation === "clinic" ? "At a Clinic" : "To be discussed personally"}
                </span>
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
