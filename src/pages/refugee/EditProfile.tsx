import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRefugeeProfile, useUpdateRefugee } from '../../hooks/useRefugee';
import TagInput from '../../components/TagInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Save, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  SKILL_OPTIONS, LANGUAGE_OPTIONS, COUNTRY_OPTIONS,
  EDUCATION_LEVELS, KAMPALA_DISTRICTS,
} from '../../lib/helpers';

export default function EditProfile() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useRefugeeProfile();
  const updateRefugee = useUpdateRefugee();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState<'unhcr' | 'govt' | 'none'>('none');
  const [languages, setLanguages] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [initialized, setInitialized] = useState(false);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  // Initialize form from profile data
  if (profile && !initialized) {
    setFullName(profile.full_name);
    setCountryOfOrigin(profile.country_of_origin);
    setLocation(profile.location);
    setPhone(profile.phone);
    setIdType(profile.id_type);
    setLanguages(profile.languages);
    setSkills(profile.skills);
    setEducationLevel(profile.education_level);
    setWorkExperience(profile.work_experience?.[0]?.description || '');
    setBusinessActivity(profile.business_activity || '');
    setInitialized(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await updateRefugee.mutateAsync({
        full_name: fullName,
        country_of_origin: countryOfOrigin,
        location,
        phone,
        id_type: idType,
        languages,
        skills,
        education_level: educationLevel,
        work_experience: workExperience ? [{ title: '', company: '', duration: '', description: workExperience }] : [],
        business_activity: businessActivity || undefined,
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
        <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-h1 text-navy mb-2">Edit Profile</h1>
        <p className="text-navy-muted text-sm mb-8">Update your information to improve your profile completeness.</p>

        <form onSubmit={handleSave} className="card-static p-6 sm:p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-forest-light text-forest rounded-lg text-sm">
              <CheckCircle2 size={16} /> Profile updated successfully!
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Full name <span className="text-red">*</span></label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Country of origin <span className="text-red">*</span></label>
              <select value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} className="input-field">
                {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Location <span className="text-red">*</span></label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-field">
                {KAMPALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Phone <span className="text-red">*</span></label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">ID Type</label>
              <select value={idType} onChange={(e) => setIdType(e.target.value as typeof idType)} className="input-field">
                <option value="none">No ID</option>
                <option value="unhcr">UNHCR ID</option>
                <option value="govt">Government ID</option>
              </select>
            </div>
            <div>
              <label className="input-label">Education level</label>
              <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="input-field">
                {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <TagInput label="Languages spoken" value={languages} onChange={setLanguages} suggestions={LANGUAGE_OPTIONS} required />
          <TagInput label="Skills" value={skills} onChange={setSkills} suggestions={SKILL_OPTIONS} required />

          <div>
            <label className="input-label">Work experience</label>
            <textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} className="input-field min-h-[100px]" placeholder="Describe your work experience..." />
          </div>

          <div>
            <label className="input-label">Business activity (optional)</label>
            <input type="text" value={businessActivity} onChange={(e) => setBusinessActivity(e.target.value)} className="input-field" />
          </div>

          <div className="pt-4 border-t border-border">
            <button type="submit" disabled={updateRefugee.isPending} className="btn-primary">
              {updateRefugee.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
