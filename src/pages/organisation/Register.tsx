import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCreateOrg } from '../../hooks/useOrganisation';
import { Building2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OrgRegister() {
  const { signUp } = useAuth();
  const createOrg = useCreateOrg();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<'ngo' | 'employer' | 'bank' | 'support'>('ngo');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!name || !contactEmail || !description) return setError('Please fill in all required fields');

    setLoading(true);
    try {
      const { error: authError } = await signUp(email, password, 'organisation');
      if (authError) throw authError;

      await new Promise((r) => setTimeout(r, 500));

      await createOrg.mutateAsync({
        name,
        org_type: orgType,
        contact_email: contactEmail,
        phone,
        website: website || undefined,
        description,
      });

      navigate('/org/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12">
      <div className="page-container max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={24} className="text-white" />
          </div>
          <h1 className="text-h1 text-navy mb-2">Register your organisation</h1>
          <p className="text-navy-muted">Post opportunities and connect with verified refugee talent</p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 bg-forest-light rounded-xl mb-6 animate-fade-in">
          <CheckCircle2 size={20} className="text-forest mt-0.5 flex-shrink-0" />
          <p className="text-sm text-navy">
            Your organisation will be reviewed by the Refugee Link team before you can post opportunities. This typically takes 1–2 business days.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-static p-6 sm:p-8 animate-slide-up space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <h3 className="text-sm font-semibold text-navy-muted uppercase tracking-wider">Account</h3>

          <div>
            <label className="input-label">Email address <span className="text-red">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="org@example.com" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Password <span className="text-red">*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="At least 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="input-label">Confirm password <span className="text-red">*</span></label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Repeat password" required />
            </div>
          </div>

          <hr className="border-border" />
          <h3 className="text-sm font-semibold text-navy-muted uppercase tracking-wider">Organisation Details</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Organisation name <span className="text-red">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your organisation name" required />
            </div>
            <div>
              <label className="input-label">Type <span className="text-red">*</span></label>
              <select value={orgType} onChange={(e) => setOrgType(e.target.value as typeof orgType)} className="input-field">
                <option value="ngo">NGO</option>
                <option value="employer">Employer</option>
                <option value="bank">Financial Institution</option>
                <option value="support">Business Support</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Contact email <span className="text-red">*</span></label>
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input-field" placeholder="contact@org.com" required />
            </div>
            <div>
              <label className="input-label">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+256 7XX XXX XXX" />
            </div>
          </div>

          <div>
            <label className="input-label">Website (optional)</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="input-field" placeholder="https://yourorg.com" />
          </div>

          <div>
            <label className="input-label">Description <span className="text-red">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field min-h-[100px]" placeholder="Describe your organisation and its mission..." required />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Link to="/login" className="btn-ghost text-sm">Already registered?</Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registering...
                </span>
              ) : 'Register Organisation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
