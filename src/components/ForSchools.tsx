import React, { useState, useRef } from 'react';
import { Check, Send, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

interface DemoFormData {
  name: string;
  school: string;
  role: string;
  email: string;
  phone: string;
  grades: string;
  city: string;
  consent: boolean;
  website: string; // Honeypot field
}

export const ForSchools: React.FC = () => {
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    school: '',
    role: 'Teacher',
    email: '',
    phone: '',
    grades: '',
    city: '',
    consent: false,
    website: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    const name = formData.name.trim();
    const school = formData.school.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const grades = formData.grades.trim();

    if (!name) {
      errs.name = 'Please provide your full name.';
    }

    if (!school) {
      errs.school = 'School or Institution name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errs.email = 'Please provide a valid school or work email address.';
    }

    // Indian mobile phone: 10 digits starting with 6-9, optional +91 or 91
    const cleanedPhone = phone.replace(/[\s\-()]/g, '');
    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!grades) {
      errs.grades = 'Specify grades taught (e.g., 6–10 or Middle School).';
    }

    if (!formData.consent) {
      errs.consent = 'You must agree to be contacted for the school demo.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    // Check honeypot: if filled, silently stop
    if (formData.website.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    const name = formData.name.trim().slice(0, 200);
    const school = formData.school.trim().slice(0, 200);
    const role = formData.role.trim().slice(0, 200);
    const grades = formData.grades.trim().slice(0, 200);
    const city = formData.city.trim().slice(0, 200);
    const email = formData.email.trim().slice(0, 200);
    const phone = formData.phone.trim().slice(0, 200);
    const submissionTime = new Date().toLocaleString();

    // 1. Build plain text WhatsApp message
    const message = `*New School Demo Request - EFACT Studio*\n` +
      `Name: ${name}\n` +
      `School: ${school}\n` +
      `Role: ${role}\n` +
      `Grades: ${grades}\n` +
      `City: ${city || '-'}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Submitted: ${submissionTime}`;

    // 2. Build URL
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);

    // 5. Save submission to localStorage under "efact_demo_requests"
    try {
      const existing = JSON.parse(localStorage.getItem('efact_demo_requests') || '[]');
      const newEntry = {
        name,
        school,
        role,
        grades,
        city,
        email,
        phone,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem('efact_demo_requests', JSON.stringify([newEntry, ...existing]));
    } catch (err) {
      // Ignore storage errors
    }

    // 3. 600ms loading state before opening WhatsApp
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        successHeadingRef.current?.focus();
      }, 100);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      school: '',
      role: 'Teacher',
      email: '',
      phone: '',
      grades: '',
      city: '',
      consent: false,
      website: '',
    });
    setErrors({});
    setSubmitted(false);
    setWhatsappUrl('');
  };

  return (
    <section id="schools" className="py-20 px-4 md:px-8 max-w-[1240px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Educational Pitch */}
        <div className="lg:col-span-6">
          <div className="inline-block px-3 py-1 rounded-full bg-yellow text-ink border-ink-2 font-mono text-xs font-bold shadow-hard-sm mb-4">
            For Educators & Administrators
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-ink tracking-tight mb-4">
            Teachers: this fits your existing curriculum.
          </h2>
          <p className="font-body text-ink-soft text-lg leading-relaxed mb-8">
            EFACT Studio plugs directly into the subjects you already teach, with an adaptive curriculum, teacher dashboards, and hands-on workshops. We handle the tools. You keep the classroom.
          </p>

          <div className="space-y-4 font-body text-base text-ink font-medium">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-hard-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Works in any browser on Chromebooks, Windows, and iPads—zero installation.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-hard-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Adaptive progression that moves students systematically from blocks to real Python.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-hard-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Advanced hands-on workshops with physical rover hardware & microcontrollers.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-hard-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Complete teacher guides, lesson plans, and dedicated educator onboarding support.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Demo Request Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-paper border-ink-2 rounded-2xl p-6 sm:p-8 shadow-hard-lg">
            {submitted ? (
              <div
                role="region"
                aria-live="polite"
                className="text-center py-8 space-y-4 font-body"
              >
                <div className="w-16 h-16 rounded-full bg-lime border-ink-2 shadow-hard flex items-center justify-center mx-auto text-ink">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3
                  ref={successHeadingRef}
                  tabIndex={-1}
                  className="font-heading font-extrabold text-2xl text-ink outline-none"
                >
                  Almost done.
                </h3>
                <p className="font-body text-ink text-base max-w-sm mx-auto">
                  WhatsApp opened with your details. Press <strong className="text-ink">Send</strong> to confirm your request.
                </p>

                <div className="pt-2 flex flex-col items-center gap-3">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full bg-lime text-ink border-ink-2 font-mono text-xs font-bold shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] flex items-center gap-1.5 transition-all"
                    >
                      <span>WhatsApp didn't open? Tap here</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={handleReset}
                    className="text-xs font-mono font-bold text-blue hover:underline mt-2"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                <div className="border-b border-ink/15 pb-3 mb-2">
                  <h3 className="font-heading font-bold text-2xl text-ink">
                    Request a School Demo
                  </h3>
                  <p className="font-mono text-xs text-ink-soft">
                    Schedule an interactive session or pilot classroom trial.
                  </p>
                </div>

                {/* Honeypot field for spam prevention */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only hidden"
                  aria-hidden="true"
                />

                {/* Name */}
                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                    placeholder="e.g. Dr. Rajesh Sharma"
                  />
                  {errors.name && (
                    <p className="font-body text-sm text-danger flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* School & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      School / Institution *
                    </label>
                    <input
                      type="text"
                      maxLength={200}
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="e.g. Delhi Public School"
                    />
                    {errors.school && (
                      <p className="font-body text-sm text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.school}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                    >
                      <option value="Teacher">Teacher</option>
                      <option value="Principal">Principal</option>
                      <option value="Coordinator">Coordinator</option>
                      <option value="Parent">Parent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      maxLength={200}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="teacher@school.edu.in"
                    />
                    {errors.email && (
                      <p className="font-body text-sm text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      maxLength={200}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="font-body text-sm text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Grades Taught & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      Grades Taught *
                    </label>
                    <input
                      type="text"
                      maxLength={200}
                      value={formData.grades}
                      onChange={(e) => setFormData({ ...formData, grades: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="e.g. Grades 6–10"
                    />
                    {errors.grades && (
                      <p className="font-body text-sm text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.grades}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      City <span className="font-normal text-ink-soft">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={200}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="e.g. Bengaluru"
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="pt-2">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="consentCheck"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="w-4 h-4 rounded border-ink-2 text-blue mt-0.5 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="consentCheck" className="font-body text-xs text-ink cursor-pointer leading-tight">
                      I agree to be contacted by EFACT Robotics about a school demo.
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="font-body text-sm text-danger flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.consent}</span>
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-blue text-white font-heading font-extrabold text-base btn-brutal flex items-center justify-center gap-2 mt-4 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request a School Demo</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
