import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRefugeeProfile } from '../../hooks/useRefugee';
import { useMyApplications } from '../../hooks/useApplications';
import { useOpportunities } from '../../hooks/useOpportunities';
import { calculateCompleteness, formatDate, applicationStatusLabels, verificationLabels, opportunityTypeLabels } from '../../lib/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  User, Edit3, Search, Briefcase, MapPin, Globe, Languages, GraduationCap,
  Phone, Shield, Clock, CheckCircle2, AlertCircle, Heart, ChevronDown, ChevronUp,
  Lightbulb, TrendingUp, FileCheck, Eye, XCircle, ArrowRight,
} from 'lucide-react';
import type { ApplicationStatus } from '../../types';

export default function RefugeeDashboard() {
  const { data: profile, isLoading: profileLoading } = useRefugeeProfile();
  const { data: applications, isLoading: appsLoading } = useMyApplications();
  const { data: opportunities } = useOpportunities();
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | ApplicationStatus>('all');

  if (profileLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-h2 text-navy mb-4">Complete your profile</h2>
          <p className="text-navy-muted mb-6">You haven't created your refugee profile yet.</p>
          <Link to="/register/refugee" className="btn-primary">Create Profile</Link>
        </div>
      </div>
    );
  }

  const completeness = calculateCompleteness(profile as any);

  // Stats
  const totalApps = applications?.length || 0;
  const shortlistedCount = applications?.filter(a => a.status === 'shortlisted').length || 0;
  const underReviewCount = applications?.filter(a => a.status === 'reviewed').length || 0;

  // Recommended opportunities — match by overlapping skills
  const recommended = (opportunities || [])
    .filter(opp => opp.required_skills?.some(skill => profile.skills.includes(skill)))
    .slice(0, 3);

  // Filtered applications
  const filteredApps = activeTab === 'all'
    ? applications
    : applications?.filter(a => a.status === activeTab);

  // Profile tips
  const tips: string[] = [];
  if (completeness < 100) {
    if (!profile.avatar_url) tips.push('Add a profile photo to stand out to employers');
    if (!profile.work_experience || profile.work_experience.length === 0) tips.push('Add work experience to improve your chances');
    if (!profile.business_activity) tips.push('Describe your business activity or goals');
  }

  const statusBadge = {
    verified: 'badge-verified',
    pending: 'badge-pending',
    unverified: 'badge-unverified',
  }[profile.verification_status];

  const statusIcon = {
    verified: <CheckCircle2 size={14} />,
    pending: <Clock size={14} />,
    unverified: <AlertCircle size={14} />,
  }[profile.verification_status];

  const tabs: { key: 'all' | ApplicationStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Briefcase size={14} /> },
    { key: 'shortlisted', label: 'Shortlisted', icon: <CheckCircle2 size={14} /> },
    { key: 'applied', label: 'Applied', icon: <FileCheck size={14} /> },
    { key: 'reviewed', label: 'Reviewed', icon: <Eye size={14} /> },
    { key: 'rejected', label: 'Rejected', icon: <XCircle size={14} /> },
  ];

  const workExperience = profile.work_experience || [];
  const visibleExperience = showAllExperience ? workExperience : workExperience.slice(0, 2);

  const tabEmptyMessages: Record<string, string> = {
    all: 'No applications yet',
    shortlisted: 'No shortlisted applications yet',
    applied: 'No pending applications',
    reviewed: 'No applications under review',
    rejected: 'No rejected applications',
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-h2 sm:text-h1 text-navy mb-1 text-balance">Welcome, {profile.full_name.split(' ')[0]}</h1>
            <p className="text-navy-muted text-sm">Your Refugee Link dashboard</p>
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
            <Link to="/opportunities" className="btn-outline text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 flex justify-center">
              <Search size={16} /> <span className="hidden xs:inline">Browse Jobs</span><span className="xs:hidden">Browse</span>
            </Link>
            <Link to="/profile/edit" className="btn-primary text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 flex justify-center">
              <Edit3 size={16} /> <span className="hidden xs:inline">Edit Profile</span><span className="xs:hidden">Edit</span>
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard icon={<Briefcase size={18} />} label="Applications" value={totalApps} />
          <StatCard icon={<CheckCircle2 size={18} />} label="Shortlisted" value={shortlistedCount} color="forest" />
          <StatCard icon={<Eye size={18} />} label="Under Review" value={underReviewCount} />
          <StatCard icon={<TrendingUp size={18} />} label="Completeness" value={`${completeness}%`} color={completeness === 100 ? 'forest' : undefined} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary */}
            <div className="card-static p-5 sm:p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-forest-light rounded-2xl flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                  ) : (
                    <User size={28} className="text-forest" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-navy">{profile.full_name}</h2>
                  <p className="font-mono text-xs text-navy-muted">{profile.ref_id}</p>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="mb-5">
                <span className={statusBadge}>
                  {statusIcon}
                  {verificationLabels[profile.verification_status]}
                </span>
              </div>

              {/* Completeness Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-navy-muted">Profile completeness</span>
                  <span className="text-xs font-semibold text-forest">{completeness}%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest rounded-full transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-3 text-sm">
                <InfoRow icon={<Globe size={15} />} label="Country" value={profile.country_of_origin} />
                <InfoRow icon={<MapPin size={15} />} label="Location" value={profile.location} />
                <InfoRow icon={<Phone size={15} />} label="Phone" value={profile.phone} />
                <InfoRow icon={<Shield size={15} />} label="ID Type" value={profile.id_type.toUpperCase()} />
                <InfoRow icon={<GraduationCap size={15} />} label="Education" value={profile.education_level} />
              </div>

              {/* Work Experience */}
              {workExperience.length > 0 && (
                <div className="mt-5 pt-5 border-t border-anthropic-border">
                  <h3 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                    <Briefcase size={16} className="text-forest" /> Work Experience
                  </h3>
                  <div className="space-y-3">
                    {visibleExperience.map((exp, i) => (
                      <div key={i} className="p-3 rounded-lg bg-anthropic-surface border border-anthropic-border">
                        <p className="text-sm font-semibold text-navy">{exp.title}</p>
                        <p className="text-xs text-navy-muted">{exp.company} · {exp.duration}</p>
                      </div>
                    ))}
                  </div>
                  {workExperience.length > 2 && (
                    <button
                      onClick={() => setShowAllExperience(!showAllExperience)}
                      className="btn-ghost text-xs mt-2 w-full"
                    >
                      {showAllExperience ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {showAllExperience ? 'Show less' : `Show ${workExperience.length - 2} more`}
                    </button>
                  )}
                </div>
              )}

              {/* Profile Tips */}
              {tips.length > 0 && (
                <div className="mt-5 pt-5 border-t border-anthropic-border">
                  <h3 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-600" /> Profile Tips
                  </h3>
                  <div className="space-y-2">
                    {tips.slice(0, 2).map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                        <ArrowRight size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skills & Languages */}
            <div className="card-static p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                <Languages size={16} className="text-forest" /> Languages
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {profile.languages.map((l) => <span key={l} className="tag">{l}</span>)}
              </div>

              <h3 className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                <Briefcase size={16} className="text-forest" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>

            {/* Donate Card */}
            <div className="card-static p-5 sm:p-6 bg-forest-light/50 border-forest/20">
              <Heart size={20} className="text-forest mb-2" />
              <h3 className="text-sm font-semibold text-navy mb-1">Support Refugee Link</h3>
              <p className="text-xs text-navy-muted mb-3">Help us connect more refugees to economic opportunities.</p>
              <a href="https://link4refugeesolutions.com/donate" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-4 w-full">
                <Heart size={14} /> Donate
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Opportunities */}
            <div className="card-static p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 text-navy flex items-center gap-2">
                  <TrendingUp size={20} className="text-forest" />
                  Opportunities Matching Your Skills
                </h2>
                <Link to="/opportunities" className="btn-ghost text-xs">
                  Browse all <ArrowRight size={14} />
                </Link>
              </div>

              {recommended.length === 0 ? (
                <div className="text-center py-8">
                  <Search size={32} className="text-anthropic-border mx-auto mb-3" />
                  <p className="text-sm text-navy-muted">No matching opportunities right now.</p>
                  <Link to="/opportunities" className="btn-ghost text-sm mt-2 inline-flex">
                    Browse all <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommended.map((opp) => (
                    <Link
                      key={opp.id}
                      to={`/opportunities/${opp.id}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-anthropic-border hover:border-forest/30 hover:bg-forest-light/30 transition-all"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-forest-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase size={18} className="text-forest" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">{opp.title}</p>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-xs text-navy-muted mt-0.5">
                          <span className="truncate">{opp.organisation?.name}</span>
                          <span className="flex items-center gap-1 flex-shrink-0"><MapPin size={12} /> {opp.location}</span>
                        </div>
                      </div>
                      <span className="tag text-[10px] sm:text-xs flex-shrink-0">{opportunityTypeLabels[opp.opp_type]}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Applications */}
            <div className="card-static p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 text-navy">My Applications</h2>
                <span className="text-sm text-navy-muted">
                  {applications?.length || 0} total
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
                {tabs.map((tab) => {
                  const count = tab.key === 'all'
                    ? (applications?.length || 0)
                    : (applications?.filter(a => a.status === tab.key).length || 0);
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                        activeTab === tab.key
                          ? 'bg-forest text-white'
                          : 'text-navy-muted hover:bg-anthropic-surface'
                      }`}
                    >
                      {tab.icon} {tab.label}
                      {count > 0 && (
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-anthropic-surface text-navy-muted'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {appsLoading ? (
                <LoadingSpinner className="py-12" />
              ) : !filteredApps || filteredApps.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={40} className="text-anthropic-border mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy mb-2">{tabEmptyMessages[activeTab]}</h3>
                  <p className="text-sm text-navy-muted mb-4">
                    {activeTab === 'all' ? 'Browse opportunities and apply to get started.' : 'Check back later for updates.'}
                  </p>
                  {activeTab === 'all' && (
                    <Link to="/opportunities" className="btn-outline text-sm">
                      <Search size={16} /> Browse Opportunities
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApps.map((app) => {
                    const opp = app.opportunity;
                    const statusClasses: Record<string, string> = {
                      applied: 'badge-pending',
                      reviewed: 'badge-pending',
                      shortlisted: 'badge-verified',
                      rejected: 'bg-red-100 text-red-700 text-xs font-medium rounded-full px-2.5 py-1 inline-flex items-center gap-1.5',
                    };
                    return (
                      <Link
                        key={app.id}
                        to={`/opportunities/${app.opportunity_id}`}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-anthropic-border hover:border-forest/30 hover:bg-forest-light/30 transition-all"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-forest-light rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase size={18} className="text-forest" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">{opp?.title || 'Opportunity'}</p>
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-[11px] sm:text-xs text-navy-muted">
                            <span className="truncate">{opp?.organisation?.name}</span>
                            <span className="hidden xs:inline">·</span>
                            <span>{formatDate(app.applied_at)}</span>
                          </div>
                        </div>
                        <span className={`${statusClasses[app.status] || 'badge-unverified'} text-[10px] sm:text-xs whitespace-nowrap`}>
                          {applicationStatusLabels[app.status]}
                        </span>
                      </Link>
                    );
                  })}
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start sm:items-center gap-3 text-navy-muted">
      <span className="text-forest flex-shrink-0 mt-0.5 sm:mt-0">{icon}</span>
      <span className="font-medium text-navy-muted w-20 flex-shrink-0 text-xs sm:text-sm uppercase sm:normal-case">{label}</span>
      <span className="text-navy break-all sm:break-normal">{value}</span>
    </div>
  );
}
