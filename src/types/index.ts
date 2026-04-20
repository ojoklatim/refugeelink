// ── Enums ──────────────────────────────────────────────
export type IdType = 'unhcr' | 'govt' | 'none';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type OrgType = 'ngo' | 'employer' | 'bank' | 'support';
export type OpportunityType = 'job' | 'training' | 'grant' | 'support';
export type OpportunityStatus = 'active' | 'closed' | 'draft';
export type ApplicationStatus = 'applied' | 'reviewed' | 'shortlisted' | 'rejected';
export type UserRole = 'refugee' | 'organisation' | 'admin';

// ── Database Row Types ─────────────────────────────────
export interface Refugee {
  id: string;
  ref_id: string;
  user_id: string;
  full_name: string;
  country_of_origin: string;
  location: string;
  phone: string;
  id_type: IdType;
  languages: string[];
  skills: string[];
  work_experience: WorkExperience[];
  education_level: string;
  business_activity?: string;
  verification_status: VerificationStatus;
  avatar_url?: string;
  created_at: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Organisation {
  id: string;
  user_id: string;
  name: string;
  org_type: OrgType;
  contact_email: string;
  phone: string;
  website?: string;
  description: string;
  approved: boolean;
  created_at: string;
}

export interface Opportunity {
  id: string;
  org_id: string;
  title: string;
  description: string;
  opp_type: OpportunityType;
  required_skills: string[];
  location: string;
  deadline: string;
  status: OpportunityStatus;
  created_at: string;
  // Joined fields
  organisation?: Organisation;
}

export interface Application {
  id: string;
  refugee_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  applied_at: string;
  // Joined fields
  refugee?: Refugee;
  opportunity?: Opportunity;
}

// ── Form Types ─────────────────────────────────────────
export interface RefugeeFormData {
  full_name: string;
  country_of_origin: string;
  location: string;
  phone: string;
  id_type: IdType;
  languages: string[];
  skills: string[];
  work_experience: WorkExperience[];
  education_level: string;
  business_activity?: string;
}

export interface OrgFormData {
  name: string;
  org_type: OrgType;
  contact_email: string;
  phone: string;
  website?: string;
  description: string;
}

export interface OpportunityFormData {
  title: string;
  description: string;
  opp_type: OpportunityType;
  required_skills: string[];
  location: string;
  deadline: string;
  status: OpportunityStatus;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// ── Stats ──────────────────────────────────────────────
export interface PlatformStats {
  totalRefugees: number;
  totalOrganisations: number;
  totalOpportunities: number;
  totalApplications: number;
}

// ── Filter Types ───────────────────────────────────────
export interface OpportunityFilters {
  type?: OpportunityType;
  skills?: string[];
  location?: string;
  search?: string;
}
