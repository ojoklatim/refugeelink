import { Link, useNavigate } from 'react-router-dom';
import { usePlatformStats } from '../../hooks/useAdmin';
import { useAllRefugees, useUpdateVerification } from '../../hooks/useRefugee';
import { useAllOrgs, useApproveOrg } from '../../hooks/useOrganisation';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, verificationLabels } from '../../lib/helpers';
import {
  Shield, Users, Building2, Briefcase, CheckCircle2,
  AlertCircle, ChevronRight, XCircle, Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboard({ initialTab = 'overview' }: { initialTab?: 'overview' | 'refugees' | 'orgs' }) {
  const { data: stats, isLoading: statsLoading } = usePlatformStats();
  const { data: refugees, isLoading: refLoading } = useAllRefugees();
  const { data: orgs, isLoading: orgsLoading } = useAllOrgs();
  const updateVerification = useUpdateVerification();
  const approveOrg = useApproveOrg();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'refugees' | 'orgs'>(initialTab);

  // Sync tab with prop if it changes (e.g. via navigation)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (statsLoading || refLoading || orgsLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  const pendingRefugees = refugees?.filter((r) => r.verification_status === 'pending') || [];
  const unverifiedRefugees = refugees?.filter((r) => r.verification_status === 'unverified') || [];
  const pendingOrgs = orgs?.filter((o) => !o.approved) || [];

  return (
    <div className="py-8 sm:py-12 bg-surface min-h-screen">
      <div className="page-container max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-white sm:hidden" />
            <Shield size={24} className="text-white hidden sm:block" />
          </div>
          <div>
            <h1 className="text-h2 sm:text-h1 text-navy">Admin Portal</h1>
            <p className="text-navy-muted text-xs sm:text-sm">Platform oversight and verification</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-border pb-px overflow-x-auto">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </TabButton>
          <TabButton active={activeTab === 'refugees'} onClick={() => setActiveTab('refugees')}>
            Refugees <span className="ml-1 px-1.5 py-0.5 bg-border rounded-full text-[10px]">{pendingRefugees.length}</span>
          </TabButton>
          <TabButton active={activeTab === 'orgs'} onClick={() => setActiveTab('orgs')}>
            Organisations <span className="ml-1 px-1.5 py-0.5 bg-border rounded-full text-[10px]">{pendingOrgs.length}</span>
          </TabButton>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users />} label="Total Refugees" value={stats?.totalRefugees || 0} />
              <StatCard icon={<Building2 />} label="Organisations" value={stats?.totalOrganisations || 0} />
              <StatCard icon={<Briefcase />} label="Opportunities" value={stats?.totalOpportunities || 0} />
              <StatCard icon={<CheckCircle2 />} label="Applications" value={stats?.totalApplications || 0} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Action Required: Orgs */}
              <div className="card-static p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 text-navy">Pending Organisations</h3>
                  <span className="badge-pending">{pendingOrgs.length}</span>
                </div>
                {pendingOrgs.length === 0 ? (
                  <p className="text-sm text-navy-muted">No organisations waiting for approval.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingOrgs.slice(0, 5).map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-navy">{org.name}</p>
                          <p className="text-xs text-navy-muted">{org.org_type.toUpperCase()} · {org.contact_email}</p>
                        </div>
                        <button
                          onClick={() => approveOrg.mutate({ id: org.id, approved: true })}
                          disabled={approveOrg.isPending}
                          className="btn-primary px-3 py-1.5 min-h-0 text-xs"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                    {pendingOrgs.length > 5 && (
                      <button onClick={() => setActiveTab('orgs')} className="w-full text-center text-sm text-forest font-medium mt-2">
                        View all {pendingOrgs.length} pending
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Required: Refugees */}
              <div className="card-static p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 text-navy">Refugees to Verify</h3>
                  <span className="badge-pending">{pendingRefugees.length + unverifiedRefugees.length}</span>
                </div>
                {(pendingRefugees.length + unverifiedRefugees.length) === 0 ? (
                  <p className="text-sm text-navy-muted">No refugees waiting for verification.</p>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {[...pendingRefugees, ...unverifiedRefugees].slice(0, 5).map((ref) => (
                      <div key={ref.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border rounded-lg gap-2">
                        <div>
                          <p className="text-sm font-semibold text-navy">{ref.full_name} <span className="font-mono text-[10px] text-navy-muted ml-1">{ref.ref_id}</span></p>
                          <p className="text-xs text-navy-muted">{ref.country_of_origin} · {ref.id_type.toUpperCase()}</p>
                        </div>
                        <div className="flex gap-1 flex-wrap sm:flex-nowrap">
                          <button
                            onClick={() => updateVerification.mutate({ id: ref.id, status: 'verified' })}
                            className="btn-outline px-3 py-1.5 min-h-0 text-xs border-forest text-forest hover:bg-forest hover:text-white"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => updateVerification.mutate({ id: ref.id, status: 'pending' })}
                            className="btn-outline px-3 py-1.5 min-h-0 text-xs border-amber text-amber hover:bg-amber hover:text-white"
                          >
                            Mark Pending
                          </button>
                        </div>
                      </div>
                    ))}
                    {(pendingRefugees.length + unverifiedRefugees.length) > 5 && (
                      <button onClick={() => setActiveTab('refugees')} className="w-full text-center text-sm text-forest font-medium mt-2">
                        View all pending
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Refugees Tab */}
        {activeTab === 'refugees' && (
          <div className="card-static p-6">
            <h2 className="text-h3 text-navy mb-6">All Refugees</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-border text-navy-muted">
                    <th className="pb-3 font-medium">Ref ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Country</th>
                    <th className="pb-3 font-medium">ID Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {refugees?.map((ref) => (
                    <tr key={ref.id} className="hover:bg-surface/50">
                      <td className="py-3 font-mono text-xs">{ref.ref_id}</td>
                      <td className="py-3 font-medium text-navy">{ref.full_name}</td>
                      <td className="py-3 text-navy-muted">{ref.country_of_origin}</td>
                      <td className="py-3 text-navy-muted">{ref.id_type.toUpperCase()}</td>
                      <td className="py-3">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          ref.verification_status === 'verified' ? 'bg-forest-light text-forest' :
                          ref.verification_status === 'pending' ? 'bg-amber-light text-amber' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {ref.verification_status}
                        </span>
                      </td>
                      <td className="py-3 text-navy-muted text-xs">{formatDate(ref.created_at)}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {ref.verification_status !== 'verified' && (
                            <button onClick={() => updateVerification.mutate({ id: ref.id, status: 'verified' })} className="p-1.5 text-forest hover:bg-forest-light rounded" title="Verify">
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {ref.verification_status !== 'pending' && (
                            <button onClick={() => updateVerification.mutate({ id: ref.id, status: 'pending' })} className="p-1.5 text-amber hover:bg-amber-light rounded" title="Mark Pending">
                              <Clock size={16} />
                            </button>
                          )}
                          {ref.verification_status !== 'unverified' && (
                            <button onClick={() => updateVerification.mutate({ id: ref.id, status: 'unverified' })} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded" title="Revoke">
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Organisations Tab */}
        {activeTab === 'orgs' && (
          <div className="card-static p-6">
            <h2 className="text-h3 text-navy mb-6">All Organisations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-border text-navy-muted">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Contact</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orgs?.map((org) => (
                    <tr key={org.id} className="hover:bg-surface/50">
                      <td className="py-3 font-medium text-navy">{org.name}</td>
                      <td className="py-3 text-navy-muted">{org.org_type.toUpperCase()}</td>
                      <td className="py-3 text-navy-muted">{org.contact_email}</td>
                      <td className="py-3">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          org.approved ? 'bg-forest-light text-forest' : 'bg-amber-light text-amber'
                        }`}>
                          {org.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 text-navy-muted text-xs">{formatDate(org.created_at)}</td>
                      <td className="py-3 text-right">
                        {!org.approved ? (
                          <button
                            onClick={() => approveOrg.mutate({ id: org.id, approved: true })}
                            className="text-xs font-medium text-forest hover:underline"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => approveOrg.mutate({ id: org.id, approved: false })}
                            className="text-xs font-medium text-red hover:underline"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
      <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center text-navy-muted">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-navy leading-none mb-1">{value}</p>
        <p className="text-xs text-navy-muted font-medium">{label}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center ${
        active ? 'border-forest text-forest' : 'border-transparent text-navy-muted hover:text-navy hover:border-border'
      }`}
    >
      {children}
    </button>
  );
}
