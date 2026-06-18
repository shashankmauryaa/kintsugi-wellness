import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
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
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Service Interested In</label>
                <select className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none bg-white">
                  <option>Individual Counselling</option>
                  <option>Student Counselling</option>
                  <option>Listening Space</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gold-800)] mb-1">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-[var(--color-gold-200)] focus:ring-2 focus:ring-[var(--color-gold-400)] focus:outline-none resize-none"></textarea>
              </div>
              <button type="button" className="w-full py-3 bg-[var(--color-gold-700)] hover:bg-[var(--color-gold-800)] text-white rounded-xl font-medium transition-colors">
                Send Message
              </button>
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
                    <p className="text-[var(--color-gold-700)]">+91 98765 43210</p>
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
              <a href="#" className="text-sm font-medium text-[var(--color-gold-700)] hover:text-[var(--color-gold-900)] underline">
                View Emergency Resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
