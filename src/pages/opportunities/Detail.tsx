import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOpportunityById } from '../../hooks/useOpportunities';
import { useApplyToOpportunity, useHasApplied } from '../../hooks/useApplications';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, daysUntilDeadline, isDeadlinePassed, opportunityTypeLabels } from '../../lib/helpers';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Building2, Briefcase, Clock,
  CheckCircle2, Send, AlertCircle, ExternalLink,
} from 'lucide-react';

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { data: opportunity, isLoading } = useOpportunityById(id || '');
  const { data: hasApplied } = useHasApplied(id || '');
  const applyMutation = useApplyToOpportunity();
  const [applyError, setApplyError] = useState('');
  const [applied, setApplied] = useState(false);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!opportunity) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-navy-muted">Opportunity not found.</p></div>;

  const deadlinePassed = isDeadlinePassed(opportunity.deadline);
  const daysLeft = daysUntilDeadline(opportunity.deadline);
  const org = opportunity.organisation;

  const handleApply = async () => {
    setApplyError('');
    try {
      await applyMutation.mutateAsync(opportunity.id);
      setApplied(true);
    } catch (err: unknown) {
      setApplyError(err instanceof Error ? err.message : 'Failed to apply');
    }
  };

  const showApplyButton = role === 'refugee' && !hasApplied && !applied && !deadlinePassed;
  const alreadyApplied = hasApplied || applied;

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container max-w-3xl">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-6">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Main Card */}
        <div className="card-static p-6 sm:p-10">
          {/* Type & Status */}
          <div className="flex items-center gap-2 mb-4">
            <span className="tag">{opportunityTypeLabels[opportunity.opp_type]}</span>
            {deadlinePassed ? (
              <span className="badge-unverified">Closed</span>
            ) : daysLeft <= 7 ? (
              <span className="badge-pending flex items-center gap-1"><Clock size={12} /> {daysLeft} days left</span>
            ) : (
              <span className="badge-verified">Active</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-h1 text-navy mb-4">{opportunity.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-navy-muted mb-6">
            {org && (
              <span className="flex items-center gap-1.5">
                <Building2 size={15} /> {org.name}
              </span>
            )}
            <span className="flex items-center gap-1.5"><MapPin size={15} /> {opportunity.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={15} /> Deadline: {formatDate(opportunity.deadline)}</span>
          </div>

          {/* Skills */}
          {opportunity.required_skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-navy mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-navy mb-2">Description</h3>
            <div className="text-sm text-navy-muted leading-relaxed whitespace-pre-wrap">
              {opportunity.description}
            </div>
          </div>

          {/* Organisation Info */}
          {org && (
            <div className="p-5 bg-surface rounded-xl mb-8">
              <h3 className="text-sm font-semibold text-navy mb-2">About the Organisation</h3>
              <p className="text-sm font-medium text-navy">{org.name}</p>
              <p className="text-xs text-navy-muted mb-2">{org.org_type.toUpperCase()}</p>
              <p className="text-sm text-navy-muted">{org.description}</p>
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-forest text-sm font-medium mt-2 hover:underline">
                  Visit website <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}

          {/* Apply Section */}
          {applyError && (
            <div className="flex items-center gap-2 p-3 bg-red-light text-red rounded-lg text-sm mb-4">
              <AlertCircle size={16} /> {applyError}
            </div>
          )}

          {alreadyApplied && (
            <div className="flex items-center gap-2 p-4 bg-forest-light text-forest rounded-xl text-sm mb-4">
              <CheckCircle2 size={18} />
              <div>
                <p className="font-semibold">Application submitted!</p>
                <p className="text-xs mt-0.5">Your profile has been sent to the organisation. Track status on your dashboard.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {showApplyButton && (
              <button onClick={handleApply} disabled={applyMutation.isPending} className="btn-primary flex-1">
                {applyMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Applying...
                  </span>
                ) : (
                  <><Send size={16} /> Apply Now</>
                )}
              </button>
            )}
            {!user && (
              <Link to="/login" className="btn-primary flex-1 text-center">
                <Send size={16} /> Log in to Apply
              </Link>
            )}
            {deadlinePassed && !alreadyApplied && (
              <div className="btn-ghost cursor-not-allowed opacity-60 flex-1 text-center">
                <Clock size={16} /> Deadline has passed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
