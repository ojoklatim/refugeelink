import { Link } from 'react-router-dom';
import {
  ArrowRight, UserPlus, Building2, Globe, Heart, ChevronRight, CheckCircle2, Shield
} from 'lucide-react';

const PARTNERS = [
  { name: 'stanbic', logo: 'https://cdn.brandfetch.io/idtBHsdHkP/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'FINCA', logo: 'https://cdn.brandfetch.io/iddaWPrEUg/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'enterprise uganda', logo: 'https://cdn.brandfetch.io/idNmVuOqZi/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'ILO', logo: 'https://cdn.brandfetch.io/idMetHnQQ7/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'UNHCR', logo: 'https://cdn.brandfetch.io/idlr2Np6uN/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'AYAN', logo: 'https://cdn.brandfetch.io/idO4WokW0-/w/2560/h/1087/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'World bank', logo: 'https://cdn.brandfetch.io/idJ7OIgl4W/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'AFDB', logo: 'https://cdn.brandfetch.io/idt0VH0cqI/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'JICA', logo: 'https://cdn.brandfetch.io/idLToMIE5i/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'IFC', logo: 'https://www.ifc.org/content/dam/ifc/corporate/logo/IFC-Logo.svg' },
  { name: 'GIZ', logo: 'https://cdn.brandfetch.io/idbDJsO_ee/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'mastercard', logo: 'https://cdn.brandfetch.io/idFw8DodCr/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'ACCION', logo: 'https://cdn.brandfetch.io/idH--0JiGV/w/504/h/288/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B' }
];

export default function Landing() {
  return (
    <div className="bg-anthropic-surface">
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="page-container relative z-10">
          <div className="max-w-4xl">
            <h1 className="font-display text-display sm:text-display-lg text-anthropic-black mb-8 animate-reveal">
              Connecting Refugees with <br />
              <span className="italic text-gradient">Verified Opportunities.</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-anthropic-muted leading-relaxed max-w-2xl mb-12 animate-fade-in animate-delay-100">
              Refugee Link is a structured digital platform that converts refugee skills into verified 
              professional profiles and connects them directly to global opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in animate-delay-200">
              <Link to="/register/refugee" className="btn-primary text-lg px-8 py-3.5 w-full sm:w-auto">
                Join as Refugee Talent
              </Link>
              <Link to="/register/organisation" className="btn-secondary text-lg px-8 py-3.5 w-full sm:w-auto">
                Partner as Organisation
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative pinched colors */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-light-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-light-green/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 -z-10" />
      </section>

      {/* ── Trusted By (Debug Mode) ───────────────────────── */}
      <section className="border-y border-anthropic-border bg-gray-50/50 py-12 overflow-hidden">
        <div className="page-container mb-8 text-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-anthropic-muted/60 uppercase">Supporting Inclusion in Uganda</span>
        </div>
        
        <div className="relative flex">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
              <PartnerLogo key={`${partner.name}-${idx}`} name={partner.name} logo={partner.logo} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Narrative Section ─────────────────────────────── */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-white border border-anthropic-border rounded-card overflow-hidden shadow-anthropic">
                <img 
                  src="/refugee_talent_hero_1776681187733.png" 
                  alt="Refugee talent" 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-light-blue border border-anthropic-border rounded-card max-w-[240px] shadow-elevated">
                <p className="text-[15px] font-display text-light-blue-text leading-tight">
                  "Skill verification is the bridge between isolation and inclusion."
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-h1 mb-8">Verification that builds trust.</h2>
              <div className="space-y-10">
                <ImpactPoint 
                  icon={<Shield className="text-anthropic-black" size={24} />}
                  title="Rigorous Profiling"
                  description="We don't just list names. We build verified professional dossiers including skills, languages, and work history."
                />
                <ImpactPoint 
                  icon={<Globe className="text-anthropic-black" size={24} />}
                  title="Direct Connectivity"
                  description="A centralized system for organisations to discover talent without the traditional barriers of displacement."
                />
                <ImpactPoint 
                  icon={<CheckCircle2 className="text-anthropic-black" size={24} />}
                  title="Ugandan Compliance"
                  description="Operating in full alignment with the OPM and the Data Protection Act (2019) to ensure safety for all."
                />
              </div>
              <div className="mt-12 pt-8 border-t border-anthropic-border">
                <Link to="/about" className="inline-flex items-center gap-2 text-anthropic-black font-medium hover:gap-3 transition-all">
                  Read our full mission <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Donation Section ─────────────────────────────── */}
      <section className="bg-white py-24 border-t border-anthropic-border">
        <div className="page-container">
          <div className="bg-anthropic-surface border border-anthropic-border rounded-card p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-light-green/20 text-light-green-text text-sm font-medium mb-6">
                <Heart size={14} className="fill-current" />
                <span>Make an Impact</span>
              </div>
              <h2 className="text-h2 mb-6">Support Refugee Economic Inclusion</h2>
              <p className="text-xl text-anthropic-muted mb-0">
                Your donations directly fund skill verification programs and connectivity infrastructure for refugee settlements in Uganda.
              </p>
            </div>
            <div className="flex-shrink-0 relative z-10">
              <Link to="/contact" className="btn-primary px-12 py-4 text-lg min-w-[200px]">
                Donate Now
              </Link>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-light-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-anthropic-black text-white py-24 relative overflow-hidden">
        <div className="page-container relative z-10 text-center max-w-3xl">
          <h2 className="font-display text-4xl sm:text-5xl mb-8">Ready to unlock human potential?</h2>
          <p className="text-xl text-white/70 mb-12">
            Whether you are a refugee looking to showcase your skills or an organisation 
            looking to hire, Refugee Link is your gateway to economic inclusion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/refugee" className="bg-white text-anthropic-black px-8 py-3.5 rounded-anthropic font-semibold hover:bg-white/90 transition-all w-full sm:w-auto">
              Get Started
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-8 py-3.5 rounded-anthropic font-semibold hover:bg-white/10 transition-all w-full sm:w-auto">
              Contact Us
            </Link>
          </div>
        </div>
        {/* Subtle pinch of green in dark mode */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-light-green/5 to-transparent pointer-events-none" />
      </section>
    </div>
  );
}

function PartnerLogo({ name, logo }: { name: string, logo: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[140px] group transition-all duration-300">
      <img 
        src={logo} 
        alt={`${name} logo`} 
        className="h-10 w-auto object-contain mb-3 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
        referrerPolicy="no-referrer"
        loading="eager"
      />
      <span className="text-[9px] font-bold tracking-wider uppercase text-anthropic-muted/40 group-hover:text-anthropic-black transition-colors duration-300">
        {name}
      </span>
    </div>
  );
}

function ImpactPoint({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-white border border-anthropic-border rounded-anthropic flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-anthropic-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
