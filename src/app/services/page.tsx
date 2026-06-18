import Link from "next/link";
import { ArrowRight, User, GraduationCap, MessagesSquare, Users } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Individual Counselling",
      description: "One-on-one sessions tailored to your unique needs, providing a safe space to explore anxiety, stress, relationships, life transitions, and emotional wellbeing.",
      duration: "50 Minutes",
      icon: User,
      tags: ["Anxiety", "Stress", "Relationships", "Life transitions"],
      href: "/book?service=individual",
    },
    {
      title: "Student Counselling",
      description: "Specialized support for students navigating academic pressure, identity exploration, career uncertainty, and peer relationships.",
      duration: "50 Minutes",
      icon: GraduationCap,
      tags: ["Academic stress", "Identity", "Career uncertainty"],
      href: "/book?service=student",
    },
    {
      title: "Listening Space Sessions",
      description: "Shorter, focused sessions meant for times when you just need to feel heard, process a specific experience, and receive emotional support.",
      duration: "30 Minutes",
      icon: MessagesSquare,
      tags: ["Feeling heard", "Processing", "Reflection"],
      href: "/book?service=listening",
    },
    {
      title: "Workshops & Psychoeducation",
      description: "Group awareness sessions and psychoeducation programs focused on mental health advocacy and collective healing.",
      duration: "Variable",
      icon: Users,
      tags: ["Group workshops", "Awareness", "Psychoeducation"],
      href: "/contact",
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center w-full pb-24">
      {/* Header */}
      <section className="w-full bg-[var(--color-gold-50)] py-20 px-8 text-center border-b border-[var(--color-gold-200)]">
        <h1 className="text-4xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-6">Our Services</h1>
        <p className="text-lg text-[var(--color-gold-800)] max-w-2xl mx-auto">
          Counselling adapted to your pace and lived experiences. Choose the support that feels right for you.
        </p>
      </section>

      {/* Services Grid */}
      <section className="w-full max-w-6xl px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-[var(--color-gold-200)] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="w-14 h-14 bg-[var(--color-gold-100)] text-[var(--color-gold-800)] rounded-2xl flex items-center justify-center mb-6">
                <service.icon size={28} />
              </div>
              <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-3">{service.title}</h2>
              <p className="text-[var(--color-gold-700)] mb-6 flex-1">
                {service.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {service.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[var(--color-gold-50)] text-[var(--color-gold-800)] text-xs rounded-md border border-[var(--color-gold-200)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[var(--color-gold-100)]">
                <span className="text-sm font-medium text-[var(--color-gold-800)] bg-[var(--color-gold-100)] px-3 py-1 rounded-full">
                  {service.duration}
                </span>
                <Link 
                  href={service.href}
                  className="flex items-center gap-2 text-[var(--color-gold-700)] font-medium hover:text-[var(--color-gold-900)] transition-colors"
                >
                  {service.title.includes("Workshops") ? "Inquire Now" : "Book Session"} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
