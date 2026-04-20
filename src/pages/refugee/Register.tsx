import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCreateRefugee } from '../../hooks/useRefugee';
import TagInput from '../../components/TagInput';
import {
  UserPlus, Eye, EyeOff, AlertCircle, ChevronRight, ChevronLeft, Check,
} from 'lucide-react';
import {
  SKILL_OPTIONS, LANGUAGE_OPTIONS, COUNTRY_OPTIONS,
  EDUCATION_LEVELS, KAMPALA_DISTRICTS,
} from '../../lib/helpers';

const STEPS = ['Account', 'Personal Info', 'Skills & Experience', 'Review'];

export default function RefugeeRegister() {
  const { signUp } = useAuth();
  const createRefugee = useCreateRefugee();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Account fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Personal fields
  const [fullName, setFullName] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState<'unhcr' | 'govt' | 'none'>('none');

  // Skills fields
  const [languages, setLanguages] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');

  const validateStep = () => {
    setError('');
    if (step === 0) {
      if (!email || !password || !confirmPassword) return setError('All fields are required'), false;
      if (password.length < 6) return setError('Password must be at least 6 characters'), false;
      if (password !== confirmPassword) return setError('Passwords do not match'), false;
      return true;
    }
    if (step === 1) {
      if (!fullName || !countryOfOrigin || !location || !phone) return setError('All required fields must be filled'), false;
      return true;
    }
    if (step === 2) {
      if (languages.length === 0) return setError('Please add at least one language'), false;
      if (skills.length === 0) return setError('Please add at least one skill'), false;
      if (!educationLevel) return setError('Please select your education level'), false;
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. Create auth account
      const { error: authError } = await signUp(email, password, 'refugee');
      if (authError) throw authError;

      // Small delay to let auth settle
      await new Promise((r) => setTimeout(r, 500));

      // 2. Create refugee profile
      await createRefugee.mutateAsync({
        full_name: fullName,
        country_of_origin: countryOfOrigin,
        location,
        phone,
        id_type: idType,
        languages,
        skills,
        work_experience: workExperience
          ? [{ title: '', company: '', duration: '', description: workExperience }]
          : [],
        education_level: educationLevel,
        business_activity: businessActivity || undefined,
      });

      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12">
      <div className="page-container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={24} className="text-white" />
          </div>
          <h1 className="text-h1 text-navy mb-2">Create your profile</h1>
          <p className="text-navy-muted">Join Refugee Link and access opportunities</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i < step ? 'bg-forest text-white' :
                i === step ? 'bg-forest text-white' :
                'bg-surface text-navy-muted border border-border'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                i <= step ? 'text-navy' : 'text-navy-muted'
              }`}>{label}</span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 ${i < step ? 'bg-forest' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card-static p-6 sm:p-8 animate-slide-up">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm mb-6">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 0: Account */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="input-label">Email address <span className="text-red">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="input-label">Password <span className="text-red">*</span></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="At least 6 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-muted hover:text-navy">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="input-label">Confirm password <span className="text-red">*</span></label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Repeat your password" />
              </div>
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="input-label">Full name <span className="text-red">*</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="input-label">Country of origin <span className="text-red">*</span></label>
                <select value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} className="input-field">
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Current location (Kampala district) <span className="text-red">*</span></label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-field">
                  <option value="">Select district</option>
                  {KAMPALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Phone / Contact <span className="text-red">*</span></label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+256 7XX XXX XXX" />
              </div>
              <div>
                <label className="input-label">ID type <span className="text-red">*</span></label>
                <select value={idType} onChange={(e) => setIdType(e.target.value as 'unhcr' | 'govt' | 'none')} className="input-field">
                  <option value="none">No ID</option>
                  <option value="unhcr">UNHCR ID</option>
                  <option value="govt">Government ID</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Skills & Experience */}
          {step === 2 && (
            <div className="space-y-5">
              <TagInput label="Languages spoken" value={languages} onChange={setLanguages} suggestions={LANGUAGE_OPTIONS} placeholder="Type a language..." required />
              <TagInput label="Skills" value={skills} onChange={setSkills} suggestions={SKILL_OPTIONS} placeholder="Type a skill..." required />
              <div>
                <label className="input-label">Education level <span className="text-red">*</span></label>
                <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} className="input-field">
                  <option value="">Select level</option>
                  {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Work experience</label>
                <textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} className="input-field min-h-[100px]" placeholder="Describe your work experience..." />
              </div>
              <div>
                <label className="input-label">Business activity (optional)</label>
                <input type="text" value={businessActivity} onChange={(e) => setBusinessActivity(e.target.value)} className="input-field" placeholder="Any current business activity" />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-h3 text-navy">Review your information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <ReviewField label="Email" value={email} />
                <ReviewField label="Full Name" value={fullName} />
                <ReviewField label="Country" value={countryOfOrigin} />
                <ReviewField label="Location" value={location} />
                <ReviewField label="Phone" value={phone} />
                <ReviewField label="ID Type" value={idType.toUpperCase()} />
                <ReviewField label="Education" value={educationLevel} />
                <ReviewField label="Business" value={businessActivity || '—'} />
              </div>
              <div>
                <span className="text-xs font-medium text-navy-muted uppercase tracking-wider">Languages</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {languages.map((l) => <span key={l} className="tag">{l}</span>)}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-navy-muted uppercase tracking-wider">Skills</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {skills.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
              {workExperience && (
                <div>
                  <span className="text-xs font-medium text-navy-muted uppercase tracking-wider">Experience</span>
                  <p className="text-sm text-navy mt-1">{workExperience}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0 ? (
              <button type="button" onClick={prevStep} className="btn-ghost">
                <ChevronLeft size={18} /> Back
              </button>
            ) : (
              <Link to="/login" className="btn-ghost text-sm">Already have an account?</Link>
            )}

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Continue <ChevronRight size={18} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating profile...
                  </span>
                ) : (
                  <>Complete Registration</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-navy-muted uppercase tracking-wider">{label}</span>
      <p className="text-sm text-navy font-medium mt-0.5">{value}</p>
    </div>
  );
}
