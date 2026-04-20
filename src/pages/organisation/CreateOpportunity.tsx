import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOpportunity } from '../../hooks/useOpportunities';
import TagInput from '../../components/TagInput';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { SKILL_OPTIONS, KAMPALA_DISTRICTS } from '../../lib/helpers';

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const createOpportunity = useCreateOpportunity();
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [oppType, setOppType] = useState<'job' | 'training' | 'grant' | 'support'>('job');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !location || !deadline) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await createOpportunity.mutateAsync({
        title,
        description,
        opp_type: oppType,
        required_skills: requiredSkills,
        location,
        deadline,
        status,
      });
      navigate('/org/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create opportunity');
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container max-w-2xl">
        <button onClick={() => navigate('/org/dashboard')} className="btn-ghost text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-h1 text-navy mb-2">Post an Opportunity</h1>
        <p className="text-navy-muted text-sm mb-8">Create a job listing, training, grant, or support opportunity for refugees.</p>

        <form onSubmit={handleSubmit} className="card-static p-6 sm:p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <label className="input-label">Title <span className="text-red">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g. Hotel Kitchen Assistant" required />
          </div>

          <div>
            <label className="input-label">Description <span className="text-red">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field min-h-[150px]" placeholder="Full role details, requirements, and what you offer..." required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Type <span className="text-red">*</span></label>
              <select value={oppType} onChange={(e) => setOppType(e.target.value as typeof oppType)} className="input-field">
                <option value="job">Job</option>
                <option value="training">Training</option>
                <option value="grant">Grant</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label className="input-label">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="input-field">
                <option value="active">Active (visible immediately)</option>
                <option value="draft">Draft (save for later)</option>
              </select>
            </div>
          </div>

          <TagInput label="Required skills" value={requiredSkills} onChange={setRequiredSkills} suggestions={SKILL_OPTIONS} placeholder="Type a skill..." />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Location <span className="text-red">*</span></label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="input-field">
                <option value="">Select location</option>
                {KAMPALA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="input-label">Application deadline <span className="text-red">*</span></label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-field" required min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button type="submit" disabled={createOpportunity.isPending} className="btn-primary">
              {createOpportunity.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </span>
              ) : (
                <><Save size={16} /> {status === 'draft' ? 'Save Draft' : 'Publish Opportunity'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
