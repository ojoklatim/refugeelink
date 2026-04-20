import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, User, Users, Building2, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const dashboardPath = role === 'admin' ? '/admin' : role === 'organisation' ? '/org/dashboard' : '/dashboard';
  const dashboardLabel = role === 'admin' ? 'Admin' : role === 'organisation' ? 'Dashboard' : 'Dashboard';
  const DashIcon = role === 'admin' ? Shield : role === 'organisation' ? Building2 : User;

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: Shield },
    { to: '/admin/refugees', label: 'Refugees', icon: Users },
    { to: '/admin/orgs', label: 'Organisations', icon: Building2 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-anthropic-surface/80 backdrop-blur-md border-b border-anthropic-border">
      <div className="page-container h-20 sm:h-28 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="https://refugee-link-nu.vercel.app/logo.png" 
            alt="Refugee Link Logo" 
            className="h-12 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/opportunities" className="text-[15px] font-medium text-anthropic-black hover:text-anthropic-muted transition-colors">
            Opportunities
          </Link>
          <Link to="/about" className="text-[15px] font-medium text-anthropic-black hover:text-anthropic-muted transition-colors">
            About
          </Link>
          
          <div className="h-4 w-[1px] bg-anthropic-border" />

          {user ? (
            <div className="flex items-center gap-6">
              {role === 'admin' ? (
                <div className="flex items-center gap-6">
                  {adminLinks.map((link) => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      className={`text-[15px] font-medium flex items-center gap-2 transition-colors ${
                        isActive(link.to) ? 'text-forest' : 'text-anthropic-black hover:text-anthropic-muted'
                      }`}
                    >
                      <link.icon size={18} strokeWidth={1.5} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link to={dashboardPath} className="text-[15px] font-medium text-anthropic-black hover:text-anthropic-muted transition-colors flex items-center gap-2">
                  <DashIcon size={18} strokeWidth={1.5} />
                  {dashboardLabel}
                </Link>
              )}
              <button onClick={handleSignOut} className="btn-primary">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-[15px] font-medium text-anthropic-black hover:text-anthropic-muted transition-colors">
                Log In
              </Link>
              <Link to="/register/refugee" className="btn-primary">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-anthropic-black"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-anthropic-border p-6 shadow-elevated animate-slide-down">
          <div className="flex flex-col gap-6">
            <Link to="/opportunities" onClick={() => setMobileOpen(false)} className="text-lg font-medium">Opportunities</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-lg font-medium">About Us</Link>
            <div className="pt-4 border-t border-anthropic-border flex flex-col gap-4">
              {user ? (
                <>
                  {role === 'admin' ? (
                    adminLinks.map((link) => (
                      <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-lg font-medium">
                        <link.icon size={20} /> {link.label}
                      </Link>
                    ))
                  ) : (
                    <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-lg font-medium">
                      <DashIcon size={20} /> Dashboard
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="btn-primary w-full mt-4">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-center">Log In</Link>
                  <Link to="/register/refugee" onClick={() => setMobileOpen(false)} className="btn-primary w-full">Join Refugee Link</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
