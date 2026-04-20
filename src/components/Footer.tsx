import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-anthropic-border">
      <div className="page-container py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <img 
                src="https://refugee-link-nu.vercel.app/logo.png" 
                alt="Refugee Link Logo" 
                className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-[15px] text-anthropic-muted leading-relaxed max-w-[240px]">
              Connecting the skills of refugees to the verified needs of organisations in Uganda.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-label text-anthropic-black uppercase mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/opportunities" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors">Browse Opportunities</Link></li>
              <li><Link to="/register/refugee" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors">Join as Talent</Link></li>
              <li><Link to="/register/organisation" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors">Post an Opportunity</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-label text-anthropic-black uppercase mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors">Our Mission</Link></li>
              <li><Link to="/contact" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors">Support Center</Link></li>
              <li><Link to="/contact" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors font-medium">Donate to our Cause</Link></li>
              <li><Link to="/terms" className="text-[15px] text-anthropic-muted hover:text-anthropic-black transition-colors">Terms & Privacy</Link></li>
            </ul>
          </div>

          {/* Impact */}
          <div>
            <h3 className="text-label text-anthropic-black uppercase mb-6">Our Impact</h3>
            <div className="p-4 bg-anthropic-surface border border-anthropic-border rounded-anthropic">
              <div className="flex items-center gap-2 text-light-green-text mb-1">
                <Heart size={14} fill="currentColor" />
                <span className="text-[13px] font-semibold uppercase tracking-wider">Livelihoods</span>
              </div>
              <p className="text-[13px] text-anthropic-muted leading-snug">
                Every verified profile is a step toward dignified economic inclusion in Uganda.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-anthropic-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-anthropic-muted">
            © {new Date().getFullYear()} Refugee Link. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-anthropic-muted flex items-center gap-1.5">
              Made with <Heart size={12} className="text-red-500 fill-red-500" /> in Kampala
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
