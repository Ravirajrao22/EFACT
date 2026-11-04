import React, { useState, useRef, useEffect } from 'react';
import { Check, CheckCircle2, AlertCircle, ExternalLink, Loader2, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

interface DemoFormData {
  name: string;
  school: string;
  role: string;
  stage: string;
  interests: string[];
  email: string;
  phone: string;
  grades: string;
  city: string;
  consent: boolean;
  website: string; // Honeypot field
}

interface ForSchoolsProps {
  initialStage?: number | null;
  initialInterests?: string[];
}

export const ForSchools: React.FC<ForSchoolsProps> = ({
  initialStage,
  initialInterests = [],
}) => {
  const stageOptions = [
    'Just starting / No coding yet',
    'Coding, no robotics',
    'Coding + robotics',
  ];

  const interestOptions = [
    'Curriculum',
    'EFACT Studio',
    'Workshops',
    'Events & Competitions',
    'Lab setup',
    'Teacher training',
  ];

  const getStageFromIndex = (idx?: number | null) => {
    if (idx === 1) return stageOptions[0];
    if (idx === 2) return stageOptions[1];
    if (idx === 3) return stageOptions[2];
    return stageOptions[0];
  };

  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    school: '',
    role: 'Teacher',
    stage: getStageFromIndex(initialStage),
    interests: initialInterests.length > 0 ? initialInterests : ['Curriculum', 'Workshops'],
    email: '',
    phone: '',
    grades: '',
    city: '',
    consent: false,
    website: '',
  });

  useEffect(() => {
    if (initialStage) {
      setFormData((prev) => ({
        ...prev,
        stage: getStageFromIndex(initialStage),
      }));
    }
  }, [initialStage]);

  useEffect(() => {
    if (initialInterests && initialInterests.length > 0) {
      setFormData((prev) => ({
        ...prev,
        interests: Array.from(new Set([...prev.interests, ...initialInterests])),
      }));
    }
  }, [initialInterests]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const next = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: next };
    });
  };

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
    const stage = formData.stage.slice(0, 200);
    const interestsList = formData.interests.join(', ') || 'General STEM Programme';
    const grades = formData.grades.trim().slice(0, 200);
    const city = formData.city.trim().slice(0, 200);
    const email = formData.email.trim().slice(0, 200);
    const phone = formData.phone.trim().slice(0, 200);
    const submissionTime = new Date().toLocaleString();

    // 1. Build plain text WhatsApp message
    const message = `*New School Demo Request - EFACT Robotics*\n` +
      `Name: ${name}\n` +
      `School: ${school}\n` +
      `Role: ${role}\n` +
      `Stage: ${stage}\n` +
      `Interested in: ${interestsList}\n` +
      `Grades: ${grades}\n` +
      `City: ${city || '-'}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Submitted: ${submissionTime}`;

    // 2. Build URL
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);

    // Save submission to localStorage under "efact_demo_requests"
    try {
      const existing = JSON.parse(localStorage.getItem('efact_demo_requests') || '[]');
      const newEntry = {
        name,
        school,
        role,
        stage,
        interests: formData.interests,
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

    // 600ms loading state before opening WhatsApp
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
      stage: stageOptions[0],
      interests: ['Curriculum', 'Workshops'],
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
    <section id="schools" className="py-[72px] md:py-24 lg:py-32 px-4 md:px-8 max-w-[1240px] mx-auto border-t-2 border-ink">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Educational Pitch */}
        <div className="lg:col-span-5">
          <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-blue mb-3 block">
            For Schools &amp; Institutions
          </span>
          <h2 className="font-heading font-extrabold text-[32px] sm:text-[42px] lg:text-[46px] leading-[1.08] tracking-tight text-ink mb-4">
            Is your school ready for a more practical approach to STEM?
          </h2>
          <p className="font-body text-ink-soft text-[18px] leading-[1.6] mb-8">
            Let's look at what your school already has, what your students need, and how practical technology education can fit into your existing academic structure.
          </p>

          <div className="space-y-4 font-body text-base text-ink font-medium">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Syllabus-aligned progression that builds on Maths and Science fundamentals.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Dedicated teacher training, lesson plans, and classroom co-teaching support.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Zero-friction browser software plus real hardware kits and prototyping labs.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-lime border-ink-2 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
              </div>
              <span>Direct WhatsApp and phone coordination for quick pilot scheduling.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Demo Request Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border-ink-2 rounded-[16px] p-6 sm:p-8 shadow-hard">
            {submitted ? (
              <div
                role="region"
                aria-live="polite"
                className="text-center py-8 space-y-4 font-body"
              >
                <div className="w-16 h-16 rounded-full bg-lime border-ink-2 shadow-hard-sm flex items-center justify-center mx-auto text-ink">
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
                  WhatsApp opened with your details. Press <strong className="text-ink">Send</strong> to confirm your discussion request.
                </p>

                <div className="pt-3 flex flex-col items-center gap-3">
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
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="border-b border-ink/15 pb-3 mb-2">
                  <h3 className="font-heading font-bold text-2xl text-ink">
                    Schedule a School Discussion
                  </h3>
                  <p className="font-mono text-xs text-ink-soft mt-0.5">
                    Discuss pilot sessions, curriculum alignment, or workshop kits for your school.
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

                {/* CURRENT STAGE (Radio, 3 options) */}
                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1.5">
                    Current Stage *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {stageOptions.map((st) => {
                      const isChecked = formData.stage === st;
                      return (
                        <label
                          key={st}
                          className={`p-2.5 rounded-lg border cursor-pointer font-body text-xs font-medium flex items-center gap-2 transition-colors ${
                            isChecked
                              ? 'bg-lime border-ink-2 text-ink font-bold shadow-sm'
                              : 'bg-paper-2 border-ink/20 text-ink-soft hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="stage"
                            value={st}
                            checked={isChecked}
                            onChange={() => setFormData({ ...formData, stage: st })}
                            className="sr-only"
                          />
                          <span className={`w-3.5 h-3.5 rounded-full border border-ink flex items-center justify-center shrink-0 ${isChecked ? 'bg-ink' : 'bg-white'}`}>
                            {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-lime" />}
                          </span>
                          <span className="leading-tight">{st}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* I'M INTERESTED IN (Multi-checkbox) */}
                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1.5">
                    I'm interested in:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {interestOptions.map((opt) => {
                      const isChecked = formData.interests.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleInterest(opt)}
                          className={`p-2 rounded-lg border text-left font-body text-xs flex items-center gap-2 transition-colors ${
                            isChecked
                              ? 'bg-white border-ink-2 font-bold text-ink shadow-sm'
                              : 'bg-paper-2 border-ink/20 text-ink-soft hover:bg-white'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded border border-ink flex items-center justify-center shrink-0 ${isChecked ? 'bg-blue text-white' : 'bg-white'}`}>
                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span className="truncate">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                    <p className="font-body text-xs text-danger flex items-center gap-1 mt-1">
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
                      <p className="font-body text-xs text-danger flex items-center gap-1 mt-1">
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
                      <option value="Teacher">Teacher / Coordinator</option>
                      <option value="Principal">Principal / Trustee</option>
                      <option value="HOD">Head of Department (STEM / CS)</option>
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
                      placeholder="coordinator@school.edu.in"
                    />
                    {errors.email && (
                      <p className="font-body text-xs text-danger flex items-center gap-1 mt-1">
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
                      <p className="font-body text-xs text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Grades & City */}
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
                      <p className="font-body text-xs text-danger flex items-center gap-1 mt-1">
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
                      placeholder="e.g. Jalandhar / Bengaluru"
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
                      I agree to be contacted by EFACT Robotics about a school demo and curriculum discussion.
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="font-body text-xs text-danger flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.consent}</span>
                    </p>
                  )}
                </div>

                {/* Submit button: "Schedule a discussion" */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-blue text-white font-heading font-extrabold text-base btn-brutal flex items-center justify-center gap-2 mt-4 disabled:opacity-60 transition-all cursor-pointer shadow-hard-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <span>Schedule a discussion</span>
                      <ArrowRight className="w-4 h-4" />
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
