import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Determine role for redirection
    let userRole: string | undefined;
    
    if (email.endsWith('@refugeelink.org')) {
      if (email.includes('admin')) userRole = 'admin';
      else if (email.includes('org')) userRole = 'organisation';
      else userRole = 'refugee';
    } else {
      const { supabase } = await import('../lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();
      userRole = user?.user_metadata?.user_role;
    }

    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'organisation') navigate('/org/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="page-container max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} className="text-white" />
          </div>
          <h1 className="text-h1 text-navy mb-2">Welcome back</h1>
          <p className="text-navy-muted">Sign in to your Refugee Link account</p>
        </div>

        <form onSubmit={handleSubmit} className="card-static p-8 animate-slide-up space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="input-label">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center pt-2 text-sm text-navy-muted">
            Don't have an account?{' '}
            <Link to="/register/refugee" className="text-forest font-medium hover:underline">
              Register as Refugee
            </Link>{' '}
            or{' '}
            <Link to="/register/organisation" className="text-forest font-medium hover:underline">
              Organisation
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
