import React, { useState } from 'react';
import { Check, Send, CheckCircle2 } from 'lucide-react';

export const ForSchools: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    role: 'Teacher',
    email: '',
    grades: '',
    hardwareInterested: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.school.trim()) errs.school = 'School or Institution name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid school email address.';
    }
    if (!formData.grades.trim()) errs.grades = 'Specify grades taught (e.g., 6-10).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate submission
    // TODO: Connect this to actual backend form endpoint / CRM integration (e.g., POST /api/school-demo)
    console.log('School demo requested:', formData);
    setSubmitted(true);
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
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-lime border-ink-2 shadow-hard flex items-center justify-center mx-auto text-ink">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-ink">
                  Demo Request Received
                </h3>
                <p className="font-body text-ink-soft text-base max-w-sm mx-auto">
                  Thanks! We'll reach out within 2 working days with school pricing, curriculum guides, and educator trial credentials.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-paper border-ink-2 font-mono text-xs font-bold text-ink shadow-hard-sm hover:bg-paper-2"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="border-b border-ink/15 pb-3 mb-4">
                  <h3 className="font-heading font-bold text-2xl text-ink">
                    Request a School Demo
                  </h3>
                  <p className="font-mono text-xs text-ink-soft">
                    Schedule an interactive session or pilot classroom trial.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                    placeholder="e.g. Dr. Rajesh Sharma"
                  />
                  {errors.name && <p className="text-danger font-mono text-xs mt-1">{errors.name}</p>}
                </div>

                {/* School & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      School / Institution *
                    </label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="e.g. Delhi Public School"
                    />
                    {errors.school && <p className="text-danger font-mono text-xs mt-1">{errors.school}</p>}
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                    >
                      <option value="Teacher">STEM / CS Teacher</option>
                      <option value="HOD">Head of Department</option>
                      <option value="Principal">Principal / Administrator</option>
                      <option value="Parent">Parent / Trustee</option>
                    </select>
                  </div>
                </div>

                {/* Email & Grades */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      School Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="teacher@school.edu.in"
                    />
                    {errors.email && <p className="text-danger font-mono text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-ink mb-1">
                      Grades Taught *
                    </label>
                    <input
                      type="text"
                      value={formData.grades}
                      onChange={(e) => setFormData({ ...formData, grades: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border-ink-2 bg-paper-2 text-ink font-body text-sm focus:outline-none focus:bg-white"
                      placeholder="e.g. Grades 6–10"
                    />
                    {errors.grades && <p className="text-danger font-mono text-xs mt-1">{errors.grades}</p>}
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="hardwareCheck"
                    checked={formData.hardwareInterested}
                    onChange={(e) => setFormData({ ...formData, hardwareInterested: e.target.checked })}
                    className="w-4 h-4 rounded border-ink-2 text-blue focus:ring-0"
                  />
                  <label htmlFor="hardwareCheck" className="font-body text-xs text-ink cursor-pointer">
                    Interested in hands-on physical robotics kits & teacher workshop kits
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-blue text-white font-heading font-extrabold text-base btn-brutal flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>Request a School Demo</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

