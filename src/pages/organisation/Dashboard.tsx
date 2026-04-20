import { Link } from 'react-router-dom';
import { useOrgProfile } from '../../hooks/useOrganisation';
import { useOrgOpportunities } from '../../hooks/useOpportunities';
import { useOpportunityApplicants } from '../../hooks/useApplications';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, opportunityTypeLabels } from '../../lib/helpers';
import {
  Building2, Plus, Briefcase, Users, Clock, AlertTriangle,
  ChevronRight, MapPin, Calendar, Eye,
} from 'lucide-react';

export default function OrgDashboard() {
  const { data: org, isLoading: orgLoading } = useOrgProfile();
  const { data: opportunities, isLoading: oppsLoading } = useOrgOpportunities();

  if (orgLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!org) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-h2 text-navy mb-4">Complete your registration</h2>
          <p className="text-navy-muted mb-6">Organisation profile not found.</p>
          <Link to="/register/organisation" className="btn-primary">Register Organisation</Link>
        </div>
      </div>
    );
  }

  const activeCount = opportunities?.filter((o) => o.status === 'active').length || 0;
  const closedCount = opportunities?.filter((o) => o.status === 'closed').length || 0;

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-h1 text-navy mb-1">{org.name}</h1>
            <div className="flex items-center gap-3 text-sm text-navy-muted">
              <span className="tag text-xs">{org.org_type.toUpperCase()}</span>
              {org.approved ? (
                <span className="badge-verified">Approved</span>
              ) : (
                <span className="badge-pending">Pending Approval</span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/org/profile" className="btn-outline text-sm">
              <Building2 size={16} /> Edit Profile
            </Link>
            {org.approved && (
              <Link to="/org/opportunities/new" className="btn-primary text-sm">
                <Plus size={16} /> Post Opportunity
              </Link>
            )}
          </div>
        </div>

        {/* Approval Warning */}
        {!org.approved && (
          <div className="flex items-start gap-3 p-4 bg-amber-light rounded-xl mb-8 border border-amber/30">
            <AlertTriangle size={20} className="text-amber mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-navy">Pending approval</p>
              <p className="text-xs text-navy-muted">Your organisation is being reviewed by the Refugee Link team. You'll be able to post opportunities once approved.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Briefcase size={20} />} label="Total Opportunities" value={opportunities?.length || 0} />
          <StatCard icon={<Eye size={20} />} label="Active" value={activeCount} color="forest" />
          <StatCard icon={<Clock size={20} />} label="Closed" value={closedCount} />
          <StatCard icon={<Users size={20} />} label="Total Applicants" value="—" />
        </div>

        {/* Opportunities List */}
        <div className="card-static p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h3 text-navy">Your Opportunities</h2>
            {org.approved && (
              <Link to="/org/opportunities/new" className="btn-ghost text-sm">
                <Plus size={16} /> New
              </Link>
            )}
          </div>

          {oppsLoading ? (
            <LoadingSpinner className="py-12" />
          ) : !opportunities || opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={40} className="text-border mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy mb-2">No opportunities posted</h3>
              <p className="text-sm text-navy-muted mb-4">
                {org.approved ? 'Create your first opportunity to start finding talent.' : 'You can post opportunities once your organisation is approved.'}
              </p>
              {org.approved && (
                <Link to="/org/opportunities/new" className="btn-primary text-sm">
                  <Plus size={16} /> Post Opportunity
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <OpportunityRow key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div className="card-static p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        color === 'forest' ? 'bg-forest-light text-forest' : 'bg-surface text-navy-muted'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-navy">{value}</p>
        <p className="text-xs text-navy-muted">{label}</p>
      </div>
    </div>
  );
}

function OpportunityRow({ opportunity: opp }: { opportunity: { id: string; title: string; opp_type: string; location: string; deadline: string; status: string; created_at: string } }) {
  const { data: applicants } = useOpportunityApplicants(opp.id);

  const statusClasses: Record<string, string> = {
    active: 'badge-verified',
    closed: 'badge-unverified',
    draft: 'badge-pending',
  };

  return (
    <Link
      to={`/org/opportunities/${opp.id}`}
      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-forest/30 hover:bg-forest-light/30 transition-all group"
    >
      <div className="w-10 h-10 bg-forest-light rounded-lg flex items-center justify-center flex-shrink-0">
        <Briefcase size={18} className="text-forest" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy truncate">{opp.title}</p>
        <div className="flex items-center gap-3 text-xs text-navy-muted mt-0.5">
          <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(opp.deadline)}</span>
          <span>{opportunityTypeLabels[opp.opp_type]}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-navy">{applicants?.length || 0}</p>
          <p className="text-xs text-navy-muted">applicants</p>
        </div>
        <span className={statusClasses[opp.status] || 'badge-unverified'}>{opp.status}</span>
        <ChevronRight size={16} className="text-navy-muted group-hover:text-forest transition-colors" />
      </div>
    </Link>
  );
}
