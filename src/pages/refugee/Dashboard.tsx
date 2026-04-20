import { Link } from 'react-router-dom';
import { useRefugeeProfile } from '../../hooks/useRefugee';
import { useMyApplications } from '../../hooks/useApplications';
import { calculateCompleteness, formatDate, applicationStatusLabels, verificationLabels } from '../../lib/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  User, Edit3, Search, Briefcase, MapPin, Globe, Languages, GraduationCap,
  Phone, Shield, Clock, CheckCircle2, AlertCircle, Heart,
} from 'lucide-react';

export default function RefugeeDashboard() {
  const { data: profile, isLoading: profileLoading } = useRefugeeProfile();
  const { data: applications, isLoading: appsLoading } = useMyApplications();

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

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-h1 text-navy mb-1">Welcome, {profile.full_name.split(' ')[0]}</h1>
            <p className="text-navy-muted text-sm">Your Refugee Link dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/opportunities" className="btn-outline text-sm">
              <Search size={16} /> Browse Jobs
            </Link>
            <Link to="/profile/edit" className="btn-primary text-sm">
              <Edit3 size={16} /> Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary */}
            <div className="card-static p-6">
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
            </div>

            {/* Skills & Languages */}
            <div className="card-static p-6">
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
            <div className="card-static p-6 bg-forest-light/50 border-forest/20">
              <Heart size={20} className="text-forest mb-2" />
              <h3 className="text-sm font-semibold text-navy mb-1">Support Refugee Link</h3>
              <p className="text-xs text-navy-muted mb-3">Help us connect more refugees to economic opportunities.</p>
              <a href="https://link4refugeesolutions.com/donate" target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-4 w-full">
                <Heart size={14} /> Donate
              </a>
            </div>
          </div>

          {/* Right Column: Applications */}
          <div className="lg:col-span-2">
            <div className="card-static p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3 text-navy">My Applications</h2>
                <span className="text-sm text-navy-muted">
                  {applications?.length || 0} total
                </span>
              </div>

              {appsLoading ? (
                <LoadingSpinner className="py-12" />
              ) : !applications || applications.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={40} className="text-border mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-navy mb-2">No applications yet</h3>
                  <p className="text-sm text-navy-muted mb-4">Browse opportunities and apply to get started.</p>
                  <Link to="/opportunities" className="btn-outline text-sm">
                    <Search size={16} /> Browse Opportunities
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => {
                    const opp = app.opportunity;
                    const statusClasses: Record<string, string> = {
                      applied: 'badge-pending',
                      reviewed: 'badge-pending',
                      shortlisted: 'badge-verified',
                      rejected: 'bg-red-light text-red text-xs font-medium rounded-pill px-2.5 py-1 inline-flex items-center gap-1.5',
                    };
                    return (
                      <Link
                        key={app.id}
                        to={`/opportunities/${app.opportunity_id}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-forest/30 hover:bg-forest-light/30 transition-all"
                      >
                        <div className="w-10 h-10 bg-forest-light rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase size={18} className="text-forest" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">{opp?.title || 'Opportunity'}</p>
                          <p className="text-xs text-navy-muted">{opp?.organisation?.name} · Applied {formatDate(app.applied_at)}</p>
                        </div>
                        <span className={statusClasses[app.status] || 'badge-unverified'}>
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-navy-muted">
      <span className="text-forest flex-shrink-0">{icon}</span>
      <span className="font-medium text-navy-muted w-20 flex-shrink-0">{label}</span>
      <span className="text-navy">{value}</span>
    </div>
  );
}
