"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, X } from "lucide-react";

export default function Contact() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Individual Counselling",
    message: ""
  });

  const handleWhatsApp = () => {
    // You can update this phone number to your actual WhatsApp number
    const phone = "+91 7557040195"; 
    const text = `Hi Khushi,\n\nI'm ${formData.name}.\nEmail: ${formData.email}\nInterested in: ${formData.service}\n\nMessage:\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phone}?text=${encodedText}`, "_blank");
  };

  const handleEmail = () => {
    const email = "mundrakhushi18@gmail.com";
    const subject = encodeURIComponent(`New Inquiry from ${formData.name} regarding ${formData.service}`);
    const body = encodeURIComponent(`Hi Khushi,\n\nI'm ${formData.name}.\nEmail: ${formData.email}\nInterested in: ${formData.service}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };
  return (
    <div className="flex-1 flex flex-col items-center w-full py-20 px-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-4">Get in Touch</h1>
          <p className="text-[var(--color-gold-700)] max-w-2xl mx-auto">
            Whether you're ready to start therapy or just have a few questions, we're here to help.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Contact Form */}
          <div className="flex-1 bg-white p-8 md:p-10 rounded-3xl border border-[var(--color-gold-200)] shadow-sm">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 h-[52px] rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 h-[52px] rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Service Interested In</label>
                <select 
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full px-4 h-[52px] rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%234b3e23%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_1rem_center] bg-no-repeat pr-10"
                >
                  <option>Individual Counselling</option>
                  <option>Student Counselling</option>
                  <option>Listening Space</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Message</label>
                <textarea 
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={handleWhatsApp}
                  className="flex-1 py-3 bg-[var(--color-gold-700)] hover:bg-[var(--color-gold-800)] text-white rounded-xl font-medium transition-colors"
                >
                  Send via WhatsApp
                </button>
                <button 
                  type="button" 
                  onClick={handleEmail}
                  className="flex-1 py-3 bg-transparent border border-[var(--color-gold-400)] text-[var(--color-gold-800)] hover:bg-[var(--color-gold-50)] rounded-xl font-medium transition-colors"
                >
                  Drop a mail
                </button>
              </div>
            </form>
          </div>

          {/* Contact Details */}
          <div className="md:w-1/3 space-y-8">
            <div>
              <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6">Contact Info</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-gold-100)] rounded-full flex items-center justify-center text-[var(--color-gold-700)] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--color-gold-900)]">Email</h3>
                    <p className="text-[var(--color-gold-700)]">mundrakhushi18@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-gold-100)] rounded-full flex items-center justify-center text-[var(--color-gold-700)] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--color-gold-900)]">Phone</h3>
                    <p className="text-[var(--color-gold-700)]">+91 7557040195</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[var(--color-gold-100)] rounded-full flex items-center justify-center text-[var(--color-gold-700)] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--color-gold-900)]">Location</h3>
                    <p className="text-[var(--color-gold-700)]">Bangalore (Offline) <br/>Currently in Gangtok<br/>(Online sessions available globally)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-gold-100)] p-6 rounded-2xl">
              <h3 className="font-heading text-lg text-[var(--color-gold-900)] mb-2">Crisis Support</h3>
              <p className="text-sm text-[var(--color-gold-800)] mb-4">
                This practice does not provide emergency crisis support. If you are experiencing an emergency, please reach out to a local helpline immediately.
              </p>
              <button 
                onClick={() => setShowModal(true)}
                className="text-sm font-medium text-[var(--color-gold-700)] hover:text-[var(--color-gold-900)] underline"
              >
                View Emergency Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl relative border border-[var(--color-gold-200)]">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-[var(--color-gold-500)] hover:text-[var(--color-gold-900)] transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4">Emergency Resources</h2>
            <p className="text-sm text-[var(--color-gold-800)] mb-6">
              If you or someone you know is in immediate mental health distress, please reach out to these 24/7 helplines:
            </p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-4 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                <div className="font-medium text-[var(--color-gold-900)]">Tele MANAS (National)</div>
                <a href="tel:14416" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">14416</a>
              </div>
              <div className="p-4 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                <div className="font-medium text-[var(--color-gold-900)]">KIRAN (Government of India)</div>
                <a href="tel:18005990019" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">1800-599-0019</a>
              </div>
              <div className="p-4 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                <div className="font-medium text-[var(--color-gold-900)]">NIMHANS</div>
                <a href="tel:08046110007" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">080-46110007</a>
                <a href="http://nimhans.ac.in/pssmhs-helpline/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold-600)] hover:text-[var(--color-gold-800)] text-sm underline block mt-1">Website</a>
              </div>
              <div className="p-4 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                <div className="font-medium text-[var(--color-gold-900)]">CADABAM'S Suicide Helpline</div>
                <div className="flex gap-4">
                  <a href="tel:09611194949" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">09611194949</a>
                  <a href="tel:09741476476" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">09741476476</a>
                </div>
              </div>
              <div className="p-4 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                <div className="font-medium text-[var(--color-gold-900)]">Vandrevala Foundation for Mental Health</div>
                <a href="tel:+919999666555" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">+91 9999 666 555</a>
                <a href="http://www.vandrevalafoundation.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold-600)] hover:text-[var(--color-gold-800)] text-sm underline block mt-1">Website</a>
              </div>
              <div className="p-4 bg-[var(--color-gold-50)] rounded-xl border border-[var(--color-gold-100)]">
                <div className="font-medium text-[var(--color-gold-900)]">AASRA</div>
                <a href="tel:9820466726" className="text-[var(--color-gold-700)] hover:underline block mt-1 font-medium text-lg">09820466726</a>
                <a href="http://www.aasra.info/helpline.html" target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold-600)] hover:text-[var(--color-gold-800)] text-sm underline block mt-1">Website</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
