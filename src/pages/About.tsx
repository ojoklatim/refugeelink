import { Globe, Shield, Users, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-anthropic-surface">
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="bg-white border-b border-anthropic-border pt-24 pb-20 sm:pt-32 sm:pb-32">
        <div className="page-container">
          <div className="max-w-3xl">
            <h1 className="font-display text-display sm:text-display-lg mb-8 animate-reveal">
              Our mission is to build <br />
              <span className="italic text-anthropic-muted">economic dignity.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-anthropic-muted leading-relaxed mb-12 animate-fade-in animate-delay-100">
              Refugee Link was founded in Kampala to address the systemic barriers that prevent displaced talent 
              from accessing the global and local market. We believe in verification as a bridge to trust.
            </p>
          </div>
        </div>
      </section>

      {/* ── Core Philosophy ────────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-h1 mb-8">The Challenge.</h2>
              <p className="text-lg text-anthropic-muted leading-relaxed mb-8">
                Uganda hosts over 1.7 million refugees, representing one of the most vibrant yet underutilized 
                talent pools in East Africa. Despite having significant skills in technology, agriculture, 
                and crafts, many remain in informal, precarious employment due to a lack of verified credentials.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 p-6 bg-light-blue border border-anthropic-border rounded-card">
                  <span className="text-3xl font-display text-light-blue-text">1.7M+</span>
                  <p className="text-[13px] uppercase tracking-widest text-light-blue-text/70 mt-2 font-semibold">Refugees in Uganda</p>
                </div>
                <div className="flex-1 p-6 bg-light-green border border-anthropic-border rounded-card">
                  <span className="text-3xl font-display text-light-green-text">80%</span>
                  <p className="text-[13px] uppercase tracking-widest text-light-green-text/70 mt-2 font-semibold">Underemployment</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="p-10 bg-white border border-anthropic-border rounded-card shadow-anthropic">
                <blockquote className="font-display text-2xl leading-relaxed text-anthropic-black italic mb-6">
                  "Skill verification is not just about a job; it's about being seen as a professional 
                  instead of a beneficiary."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-anthropic-black rounded-anthropic flex items-center justify-center text-white font-bold">RL</div>
                  <div>
                    <p className="font-medium">Refugee Link Vision</p>
                    <p className="text-sm text-anthropic-muted">Kampala, Uganda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ───────────────────────────────────── */}
      <section className="bg-white border-y border-anthropic-border section-padding">
        <div className="page-container text-center max-w-4xl mx-auto">
          <h2 className="text-h1 mb-16">The values that guide us.</h2>
          <div className="grid sm:grid-cols-3 gap-12 text-left">
            <ValueItem 
              icon={<Shield size={24} />}
              title="Verification First"
              description="We believe trust is built on rigorous, transparent verification of skills and history."
            />
            <ValueItem 
              icon={<Heart size={24} />}
              title="Refugee-Led"
              description="Our systems are designed by and for those who understand displacement firsthand."
            />
            <ValueItem 
              icon={<CheckCircle2 size={24} />}
              title="Inclusion Always"
              description="We advocate for policies and systems that integrate refugees into the formal economy."
            />
          </div>
        </div>
      </section>

      {/* ── Call to Action ────────────────────────────────── */}
      <section className="section-padding bg-anthropic-surface">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="text-h2 mb-8">Join our community.</h2>
          <p className="text-lg text-anthropic-muted mb-10">
            We are always looking for partners, organisations, and talent to join our mission of building 
            a more inclusive economic future in Uganda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary px-8">Contact Our Team</Link>
            <Link to="/opportunities" className="btn-secondary px-8">Browse Opportunities</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div>
      <div className="mb-6 text-anthropic-black">{icon}</div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-anthropic-muted leading-relaxed text-[15px]">{description}</p>
    </div>
  );
}
