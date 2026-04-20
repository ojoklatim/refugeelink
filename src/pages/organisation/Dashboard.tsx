import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useOrgProfile } from '../../hooks/useOrganisation';
import { useOrgOpportunities } from '../../hooks/useOpportunities';
import { useOpportunityApplicants, useUpdateApplicationStatus } from '../../hooks/useApplications';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, formatRelativeDate, opportunityTypeLabels, orgTypeLabels, daysUntilDeadline, applicationStatusLabels } from '../../lib/helpers';
import {
  Building2, Plus, Briefcase, Users, Clock, AlertTriangle,
  ChevronRight, ChevronDown, ChevronUp, MapPin, Calendar, Eye,
  Mail, Phone, Globe, ExternalLink, Edit3, CheckCircle2, Shield,
  Activity,
} from 'lucide-react';
import type { Opportunity, Application, ApplicationStatus } from '../../types';

export default function OrgDashboard() {
  const { data: org, isLoading: orgLoading } = useOrgProfile();
  const { data: opportunities, isLoading: oppsLoading } = useOrgOpportunities();
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({});
  const [allApplicantData, setAllApplicantData] = useState<Record<string, Application[]>>({});
  const [descExpanded, setDescExpanded] = useState(false);

  const handleApplicantsLoaded = useCallback((oppId: string, count: number, apps: Application[]) => {
    setApplicantCounts(prev => {
      if (prev[oppId] === count) return prev;
      return { ...prev, [oppId]: count };
    });
    setAllApplicantData(prev => {
      if (prev[oppId]?.length === apps.length) return prev;
      return { ...prev, [oppId]: apps };
    });
  }, []);

  const totalApplicants = useMemo(() =>
    Object.values(applicantCounts).reduce((sum, c) => sum + c, 0),
    [applicantCounts]
  );

  // Recent activity feed: last 5 application events across all opportunities
  const recentActivity = useMemo(() => {
    const items: Array<{ application: Application; opportunityTitle: string; opportunityId: string }> = [];
    for (const opp of (opportunities || [])) {
      const apps = allApplicantData[opp.id] || [];
      for (const app of apps) {
        items.push({ application: app, opportunityTitle: opp.title, opportunityId: opp.id });
      }
    }
    return items
      .sort((a, b) => new Date(b.application.applied_at).getTime() - new Date(a.application.applied_at).getTime())
      .slice(0, 5);
  }, [opportunities, allApplicantData]);

  // Deadline alerts: active opportunities with deadline within 7 days
  const upcomingDeadlines = useMemo(() =>
    (opportunities || []).filter(opp => {
      if (opp.status !== 'active') return false;
      const days = daysUntilDeadline(opp.deadline);
      return days >= 0 && days <= 7;
    }),
    [opportunities]
  );

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-h2 sm:text-h1 text-navy mb-1 text-balance">{org.name}</h1>
            <div className="flex items-center gap-3 text-sm text-navy-muted">
              <span className="tag text-xs">{org.org_type.toUpperCase()}</span>
              {org.approved ? (
                <span className="badge-verified">Approved</span>
              ) : (
                <span className="badge-pending">Pending</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
            <Link to="/org/profile" className="btn-outline text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 flex justify-center">
              <Building2 size={16} /> <span className="hidden xs:inline">Edit Profile</span><span className="xs:hidden">Profile</span>
            </Link>
            {org.approved && (
              <Link to="/org/opportunities/new" className="btn-primary text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 flex justify-center">
                <Plus size={16} /> <span className="hidden xs:inline">Post Job</span><span className="xs:hidden">Post</span>
              </Link>
            )}
          </div>
        </div>

        {/* Approval Warning */}
        {!org.approved && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl mb-8 border border-amber-300/30">
            <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-navy">Pending approval</p>
              <p className="text-xs text-navy-muted">Your organisation is being reviewed by the Refugee Link team. You'll be able to post opportunities once approved.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard icon={<Briefcase size={18} />} label="Total Opps" value={opportunities?.length || 0} />
          <StatCard icon={<Eye size={18} />} label="Active" value={activeCount} color="forest" />
          <StatCard icon={<Clock size={18} />} label="Closed" value={closedCount} />
          <StatCard icon={<Users size={18} />} label="Applicants" value={totalApplicants} color="forest" />
        </div>

        {/* Org Profile Summary Card */}
        <div className="card-static p-5 sm:p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-h3 text-navy flex items-center gap-2">
              <Building2 size={20} className="text-forest" /> Organisation Profile
            </h2>
            <Link to="/org/profile" className="btn-ghost text-xs">
              <Edit3 size={14} /> Edit
            </Link>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className={`text-sm text-navy-muted ${!descExpanded ? 'line-clamp-2' : ''}`}>
              {org.description}
            </p>
            {org.description && org.description.length > 120 && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="btn-ghost text-xs mt-1 p-0"
              >
                {descExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-4 text-sm">
            <div className="flex items-center gap-3 text-navy-muted min-w-0">
              <Mail size={15} className="text-forest flex-shrink-0" />
              <span className="text-navy truncate" title={org.contact_email}>{org.contact_email}</span>
            </div>
            <div className="flex items-center gap-3 text-navy-muted min-w-0">
              <Phone size={15} className="text-forest flex-shrink-0" />
              <span className="text-navy">{org.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-navy-muted min-w-0">
              <Shield size={15} className="text-forest flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-navy">{orgTypeLabels[org.org_type] || org.org_type}</span>
                {org.approved ? (
                  <span className="badge-verified text-[10px]"><CheckCircle2 size={10} /> Approved</span>
                ) : (
                  <span className="badge-pending text-[10px]"><Clock size={10} /> Pending</span>
                )}
              </div>
            </div>
            {org.website && (
              <div className="flex items-center gap-3 text-navy-muted min-w-0">
                <Globe size={15} className="text-forest flex-shrink-0" />
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest hover:underline inline-flex items-center gap-1 truncate"
                >
                  <span className="truncate">{org.website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink size={12} className="flex-shrink-0" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Deadline Alerts */}
        {upcomingDeadlines.length > 0 && (
          <div className="space-y-3 mb-8">
            {upcomingDeadlines.map((opp) => {
              const days = daysUntilDeadline(opp.deadline);
              return (
                <Link
                  key={opp.id}
                  to={`/org/opportunities/${opp.id}`}
                  className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-300/30 hover:border-amber-400/50 transition-all"
                >
                  <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">
                      {opp.title} closes in {days === 0 ? 'less than a day' : `${days} day${days === 1 ? '' : 's'}`}
                    </p>
                    <p className="text-xs text-navy-muted">Consider reviewing applicants before the deadline</p>
                  </div>
                  <ChevronRight size={16} className="text-amber-600 mt-0.5" />
                </Link>
              );
            })}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column: Opportunities List */}
          <div className="lg:col-span-2">
            <div className="card-static p-5 sm:p-6">
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
                  <Briefcase size={40} className="text-anthropic-border mx-auto mb-4" />
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
                    <OpportunityRow
                      key={opp.id}
                      opportunity={opp}
                      onApplicantsLoaded={handleApplicantsLoaded}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recent Activity Feed */}
          <div className="lg:col-span-1">
            <div className="card-static p-5 sm:p-6">
              <h2 className="text-h3 text-navy flex items-center gap-2 mb-6">
                <Activity size={20} className="text-forest" /> Recent Activity
              </h2>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity size={32} className="text-anthropic-border mx-auto mb-3" />
                  <p className="text-sm text-navy-muted">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={`${item.application.id}-${i}`} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-forest-light rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users size={14} className="text-forest" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-navy">
                          <span className="font-semibold">{item.application.refugee?.full_name || 'Applicant'}</span>
                          {' applied to '}
                          <Link to={`/org/opportunities/${item.opportunityId}`} className="font-semibold text-forest hover:underline">
                            {item.opportunityTitle}
                          </Link>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={
                            item.application.status === 'shortlisted' ? 'badge-verified' :
                            item.application.status === 'rejected' ? 'bg-red-100 text-red-700 text-xs font-medium rounded-full px-2 py-0.5 inline-flex items-center' :
                            'badge-pending'
                          }>
                            {applicationStatusLabels[item.application.status]}
                          </span>
                          <span className="text-[11px] text-navy-muted">
                            {formatRelativeDate(item.application.applied_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div className="card-static p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
        color === 'forest' ? 'bg-forest-light text-forest' : 'bg-anthropic-surface text-navy-muted'
      }`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-base sm:text-2xl font-bold text-navy truncate">{value}</p>
        <p className="text-[10px] sm:text-xs text-navy-muted truncate uppercase tracking-tight sm:tracking-normal">{label}</p>
      </div>
    </div>
  );
}

function OpportunityRow({ opportunity: opp, onApplicantsLoaded }: {
  opportunity: Opportunity;
  onApplicantsLoaded: (id: string, count: number, apps: Application[]) => void;
}) {
  const { data: applicants } = useOpportunityApplicants(opp.id);
  const updateStatus = useUpdateApplicationStatus();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (applicants) {
      onApplicantsLoaded(opp.id, applicants.length, applicants);
    }
  }, [applicants, opp.id, onApplicantsLoaded]);

  const statusClasses: Record<string, string> = {
    active: 'badge-verified',
    closed: 'badge-unverified',
    draft: 'badge-pending',
  };

  const recentApplicants = (applicants || []).slice(0, 3);

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateStatus.mutate({ id: appId, status: newStatus });
  };

  return (
    <div className="rounded-xl border border-anthropic-border hover:border-forest/30 transition-all">
      {/* Main row */}
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-forest-light rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase size={18} className="text-forest" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-navy truncate">{opp.title}</p>
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-[11px] sm:text-xs text-navy-muted mt-0.5">
            <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(opp.deadline)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-navy">{applicants?.length || 0}</p>
            <p className="text-xs text-navy-muted">applicants</p>
          </div>
          <span className={`${statusClasses[opp.status] || 'badge-unverified'} text-[10px] sm:text-xs`}>{opp.status}</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-anthropic-surface transition-colors"
            title={expanded ? 'Collapse' : 'View applicants'}
          >
            {expanded ? <ChevronUp size={16} className="text-forest" /> : <ChevronDown size={16} className="text-navy-muted" />}
          </button>
        </div>
      </div>

      {/* Expanded applicant quick-view */}
      {expanded && (
        <div className="border-t border-anthropic-border bg-anthropic-surface/50 p-4">
          {recentApplicants.length === 0 ? (
            <p className="text-sm text-navy-muted text-center py-4">No applicants yet</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-navy-muted uppercase tracking-wide">Recent Applicants</p>
              {recentApplicants.map((app) => (
                <div key={app.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-anthropic-border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy truncate">
                        {app.refugee?.full_name || 'Applicant'}
                      </p>
                      {app.refugee?.verification_status === 'verified' && (
                        <span className="badge-verified text-[10px]"><CheckCircle2 size={10} /></span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(app.refugee?.skills || []).slice(0, 2).map(skill => (
                        <span key={skill} className="tag text-[10px]">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className="text-xs border border-anthropic-border rounded-lg px-2 py-1.5 bg-white text-navy focus:outline-none focus:border-forest cursor-pointer"
                    disabled={updateStatus.isPending}
                  >
                    <option value="applied">Applied</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ))}
              <Link
                to={`/org/opportunities/${opp.id}`}
                className="btn-ghost text-xs w-full justify-center"
              >
                View All Applicants <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
