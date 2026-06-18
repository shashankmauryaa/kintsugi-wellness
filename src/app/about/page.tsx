import { Sparkles, GraduationCap, Heart, HandHeart, Leaf } from "lucide-react";

export default function About() {
  return (
    <div className="flex-1 flex flex-col items-center w-full bg-white">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-8 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-heading text-[var(--color-gold-900)] mb-6">About Khushi Mundra</h1>
        <p className="text-lg text-[var(--color-gold-700)] max-w-2xl mx-auto">
          Counselling Psychologist dedicated to providing a warm, reflective, and safe space for healing and personal growth.
        </p>
      </section>

      {/* Two Column Section */}
      <section className="w-full max-w-6xl px-8 pb-24 flex flex-col md:flex-row gap-16 items-start">
        <div className="flex-1 w-full relative">
          {/* Profile Image */}
          <div className="w-full aspect-[4/5] bg-[var(--color-gold-100)] rounded-3xl overflow-hidden relative border border-[var(--color-gold-200)]">
            <img 
              src="/khushi.jpg" 
              alt="Khushi Mundra Profile Photo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-12">
          {/* Background */}
          <div>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
              <GraduationCap className="text-[var(--color-gold-500)]" /> Professional Background
            </h2>
            <ul className="space-y-3 text-[var(--color-gold-800)]">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                MSc in Counselling Psychology
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                CHRIST (Deemed to be University), Bangalore
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)] shrink-0" />
                200+ supervised counselling hours
              </li>
            </ul>
          </div>

          {/* Approach */}
          <div>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
              <Heart className="text-[var(--color-gold-500)]" /> Therapeutic Approach
            </h2>
            <p className="text-[var(--color-gold-800)] mb-4 leading-relaxed">
              My work is relational and trauma-informed. Rather than following one fixed model, therapy is adapted to the unique needs, pace, and lived experiences of each client.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Humanistic', 'Somatic', 'Emotion-Focused', 'Narrative'].map((approach) => (
                <div key={approach} className="bg-[var(--color-gold-50)] px-4 py-3 rounded-xl border border-[var(--color-gold-200)] text-[var(--color-gold-900)] text-sm font-medium text-center">
                  {approach}
                </div>
              ))}
            </div>
          </div>

          {/* What to Expect */}
          <div>
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)] mb-4 flex items-center gap-3">
              <HandHeart className="text-[var(--color-gold-500)]" /> What Clients Can Expect
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Warmth', 'Curiosity', 'Collaboration', 'Respect', 'Reflection', 'Honest conversations'].map((item) => (
                <span key={item} className="px-4 py-2 bg-white border border-[var(--color-gold-300)] rounded-full text-sm text-[var(--color-gold-800)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="w-full bg-[var(--color-gold-50)] py-20 px-8 border-y border-[var(--color-gold-200)] text-center">
        <div className="max-w-3xl mx-auto">
          <Leaf className="mx-auto text-[var(--color-gold-500)] mb-6" size={32} />
          <h3 className="text-2xl font-heading text-[var(--color-gold-900)] mb-6 leading-relaxed">
            "People are more than the difficulties they bring into therapy. Growth often happens through curiosity, reflection, and understanding."
          </h3>
        </div>
      </section>
    </div>
  );
}
