import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrgProfile, useUpdateOrg } from '../../hooks/useOrganisation';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditOrgProfile() {
  const navigate = useNavigate();
  const { data: org, isLoading } = useOrgProfile();
  const updateOrg = useUpdateOrg();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<'ngo' | 'employer' | 'bank' | 'support'>('ngo');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  if (org && !initialized) {
    setName(org.name);
    setOrgType(org.org_type);
    setContactEmail(org.contact_email);
    setPhone(org.phone);
    setWebsite(org.website || '');
    setDescription(org.description);
    setInitialized(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      await updateOrg.mutateAsync({
        name,
        org_type: orgType,
        contact_email: contactEmail,
        phone,
        website: website || undefined,
        description,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container max-w-2xl">
        <button onClick={() => navigate('/org/dashboard')} className="btn-ghost text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-h1 text-navy mb-2">Edit Organisation Profile</h1>
        <p className="text-navy-muted text-sm mb-8">Update your organisation information.</p>

        <form onSubmit={handleSave} className="card-static p-6 sm:p-8 space-y-5">
          {error && <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm"><AlertCircle size={16} /> {error}</div>}
          {success && <div className="flex items-center gap-2 p-3 bg-forest-light text-forest rounded-lg text-sm"><CheckCircle2 size={16} /> Profile updated!</div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Name <span className="text-red">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Type</label>
              <select value={orgType} onChange={(e) => setOrgType(e.target.value as typeof orgType)} className="input-field">
                <option value="ngo">NGO</option>
                <option value="employer">Employer</option>
                <option value="bank">Financial Institution</option>
                <option value="support">Business Support</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="input-label">Contact email</label><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="input-field" /></div>
            <div><label className="input-label">Phone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" /></div>
          </div>
          <div><label className="input-label">Website</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="input-field" /></div>
          <div><label className="input-label">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field min-h-[100px]" /></div>

          <div className="pt-4 border-t border-border">
            <button type="submit" disabled={updateOrg.isPending} className="btn-primary">
              {updateOrg.isPending ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
