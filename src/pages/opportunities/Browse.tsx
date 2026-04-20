import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOpportunities } from '../../hooks/useOpportunities';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, daysUntilDeadline, opportunityTypeLabels } from '../../lib/helpers';
import type { OpportunityType, OpportunityFilters } from '../../types';
import {
  Search, MapPin, Calendar, Briefcase, Building2, Filter,
  X, Clock, ChevronRight,
} from 'lucide-react';

export default function BrowseOpportunities() {
  const [filters, setFilters] = useState<OpportunityFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data: opportunities, isLoading } = useOpportunities(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput || undefined }));
  };

  const setTypeFilter = (type?: OpportunityType) => {
    setFilters((f) => ({ ...f, type }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
  };

  const hasFilters = filters.type || filters.search || filters.location;

  return (
    <div className="py-8 sm:py-12">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-h1 text-navy mb-3">Browse Opportunities</h1>
          <p className="text-navy-muted max-w-lg mx-auto">
            Find jobs, training programmes, grants, and support services from verified organisations.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-muted" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search opportunities..."
                className="input-field pl-11 pr-4"
              />
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="btn-primary flex-1 sm:flex-none">Search</button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-ghost p-3 h-full ${showFilters ? 'bg-forest-light text-forest' : 'border border-anthropic-border'}`}
              >
                <Filter size={18} />
              </button>
            </div>
          </div>
        </form>

        {/* Filter Bar */}
        {showFilters && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-surface rounded-xl border border-border animate-slide-down">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-navy">Filters</span>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-forest hover:underline flex items-center gap-1">
                  <X size={12} /> Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterPill active={!filters.type} onClick={() => setTypeFilter(undefined)}>All</FilterPill>
              <FilterPill active={filters.type === 'job'} onClick={() => setTypeFilter('job')}>Jobs</FilterPill>
              <FilterPill active={filters.type === 'training'} onClick={() => setTypeFilter('training')}>Training</FilterPill>
              <FilterPill active={filters.type === 'grant'} onClick={() => setTypeFilter('grant')}>Grants</FilterPill>
              <FilterPill active={filters.type === 'support'} onClick={() => setTypeFilter('support')}>Support</FilterPill>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : !opportunities || opportunities.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="text-border mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy mb-2">No opportunities found</h3>
            <p className="text-sm text-navy-muted mb-4">
              {hasFilters ? 'Try adjusting your filters or search terms.' : 'Check back soon for new listings.'}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-outline text-sm">Clear filters</button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-navy-muted mb-4">{opportunities.length} opportunit{opportunities.length === 1 ? 'y' : 'ies'} found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map((opp) => {
                const daysLeft = daysUntilDeadline(opp.deadline);
                const isExpiring = daysLeft <= 7 && daysLeft > 0;

                return (
                  <Link
                    key={opp.id}
                    to={`/opportunities/${opp.id}`}
                    className="card group flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="tag text-xs">{opportunityTypeLabels[opp.opp_type]}</span>
                      {isExpiring && (
                        <span className="flex items-center gap-1 text-xs text-amber font-medium">
                          <Clock size={12} /> {daysLeft}d left
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-navy mb-2 group-hover:text-forest transition-colors line-clamp-2">
                      {opp.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-navy-muted mb-3">
                      <Building2 size={13} />
                      <span className="truncate">{opp.organisation?.name || 'Organisation'}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-navy-muted mb-4">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(opp.deadline)}</span>
                    </div>

                    {opp.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {opp.required_skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-surface text-navy-muted rounded-full">{s}</span>
                        ))}
                        {opp.required_skills.length > 3 && (
                          <span className="text-xs text-navy-muted">+{opp.required_skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-navy-muted">Posted {formatDate(opp.created_at)}</span>
                      <span className="text-forest text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
        active ? 'bg-forest text-white' : 'bg-white text-navy-muted border border-border hover:border-forest/30'
      }`}
    >
      {children}
    </button>
  );
}
