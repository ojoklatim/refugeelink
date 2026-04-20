import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOpportunityById } from '../../hooks/useOpportunities';
import { useOpportunityApplicants, useUpdateApplicationStatus } from '../../hooks/useApplications';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, applicationStatusLabels, opportunityTypeLabels } from '../../lib/helpers';
import {
  ArrowLeft, MapPin, Calendar, Briefcase, Users, User,
  Globe, GraduationCap, CheckCircle2, XCircle, Eye,
} from 'lucide-react';
import type { ApplicationStatus } from '../../types';

export default function ManageOpportunity() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: opportunity, isLoading: oppLoading } = useOpportunityById(id || '');
  const { data: applicants, isLoading: appsLoading } = useOpportunityApplicants(id || '');
  const updateStatus = useUpdateApplicationStatus();

  if (oppLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!opportunity) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-navy-muted">Opportunity not found.</p></div>;

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    await updateStatus.mutateAsync({ id: appId, status });
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container">
        <button onClick={() => navigate('/org/dashboard')} className="btn-ghost text-sm mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Opportunity Header */}
        <div className="card-static p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="tag text-xs">{opportunityTypeLabels[opportunity.opp_type]}</span>
                <span className={opportunity.status === 'active' ? 'badge-verified' : 'badge-unverified'}>
                  {opportunity.status}
                </span>
              </div>
              <h1 className="text-h1 text-navy">{opportunity.title}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-navy-muted">
            <span className="flex items-center gap-1"><MapPin size={14} /> {opportunity.location}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Deadline: {formatDate(opportunity.deadline)}</span>
            <span className="flex items-center gap-1"><Users size={14} /> {applicants?.length || 0} applicants</span>
          </div>
          {opportunity.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {opportunity.required_skills.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          )}
        </div>

        {/* Applicants */}
        <div className="card-static p-6">
          <h2 className="text-h3 text-navy mb-6">Applicants</h2>

          {appsLoading ? (
            <LoadingSpinner className="py-12" />
          ) : !applicants || applicants.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="text-border mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy mb-2">No applicants yet</h3>
              <p className="text-sm text-navy-muted">Applicants will appear here as refugees apply.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applicants.map((app) => {
                const refugee = app.refugee;
                if (!refugee) return null;

                return (
                  <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border hover:border-forest/30 transition-colors">
                    <div className="w-12 h-12 bg-forest-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">{refugee.full_name}</p>
                      <p className="font-mono text-xs text-navy-muted">{refugee.ref_id}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-navy-muted">
                        <span className="flex items-center gap-1"><Globe size={12} /> {refugee.country_of_origin}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {refugee.location}</span>
                        <span className="flex items-center gap-1"><GraduationCap size={12} /> {refugee.education_level}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {refugee.skills.slice(0, 4).map((s) => <span key={s} className="tag text-xs py-0.5">{s}</span>)}
                        {refugee.skills.length > 4 && <span className="text-xs text-navy-muted">+{refugee.skills.length - 4}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                      <span className={`text-xs ${
                        app.status === 'shortlisted' ? 'badge-verified' :
                        app.status === 'rejected' ? 'bg-red-light text-red px-2.5 py-1 rounded-pill font-medium' :
                        'badge-pending'
                      }`}>
                        {applicationStatusLabels[app.status]}
                      </span>
                      <div className="flex gap-1 ml-auto sm:ml-0">
                        <button
                          onClick={() => handleStatusChange(app.id, 'reviewed')}
                          className="p-2 text-navy-muted hover:text-navy hover:bg-surface rounded-lg transition-colors"
                          title="Mark Reviewed"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'shortlisted')}
                          className="p-2 text-forest hover:bg-forest-light rounded-lg transition-colors"
                          title="Shortlist"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          className="p-2 text-red hover:bg-red-light rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
