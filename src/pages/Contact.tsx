import { Mail, MessageSquare, MapPin, Globe, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-anthropic-surface min-h-screen">
      {/* ── Header ────────────────────────────────────────── */}
      <section className="bg-white border-b border-anthropic-border pt-24 pb-20">
        <div className="page-container">
          <div className="max-w-2xl">
            <h1 className="font-display text-display sm:text-display-lg mb-6 animate-reveal">
              How can we help?
            </h1>
            <p className="text-xl text-anthropic-muted leading-relaxed animate-fade-in animate-delay-100">
              Whether you are an organisation looking to hire, or a refugee needing technical support, 
              our team is here to guide you.
            </p>
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-anthropic-border rounded-card p-10 shadow-anthropic">
                <form className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label className="input-label">Full Name</label>
                      <input type="text" className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="input-label">Email Address</label>
                      <input type="email" className="input-field" placeholder="john@example.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="input-label">Subject</label>
                    <select className="input-field appearance-none bg-no-repeat bg-[right_1rem_center]">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Partnership Proposal</option>
                      <option>Verification Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Message</label>
                    <textarea rows={6} className="input-field resize-none" placeholder="How can we help you today?"></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-lg">
                    Send Message <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>

            {/* Side Info */}
            <div className="lg:col-span-2 space-y-12 pt-4">
              <ContactCard 
                icon={<Mail size={24} />}
                title="Email Us"
                content="info@link4refugeesolutions.com"
                description="We typically respond within 24 hours."
              />
              <ContactCard 
                icon={<MapPin size={24} />}
                title="Our Office"
                content="Kampala, Uganda"
                description="Our team operates primarily in Central and Western regions."
              />
              <ContactCard 
                icon={<Globe size={24} />}
                title="Global Outreach"
                content="Remote Verification"
                description="Available for organisations worldwide looking for Ugandan talent."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({ icon, title, content, description }: { icon: React.ReactNode, title: string, content: string, description: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-white border border-anthropic-border rounded-anthropic flex items-center justify-center text-anthropic-black">
        {icon}
      </div>
      <div>
        <h3 className="text-label uppercase tracking-widest text-anthropic-muted mb-2">{title}</h3>
        <p className="text-xl font-medium mb-1">{content}</p>
        <p className="text-anthropic-muted text-[15px]">{description}</p>
      </div>
    </div>
  );
}
