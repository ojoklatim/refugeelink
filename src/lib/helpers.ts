// ── Refugee ID Generator ───────────────────────────────
export function generateRefugeeId(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0');
  return `RL-${year}-${seq}`;
}

// ── Profile Completeness Calculator ────────────────────
export function calculateCompleteness(profile: Record<string, unknown>): number {
  const fields = [
    'full_name',
    'country_of_origin',
    'location',
    'phone',
    'id_type',
    'languages',
    'skills',
    'work_experience',
    'education_level',
    'avatar_url',
    'business_activity',
  ];

  let filled = 0;
  for (const field of fields) {
    const val = profile[field];
    if (val === null || val === undefined || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    filled++;
  }

  return Math.round((filled / fields.length) * 100);
}

// ── Date Formatting ────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
}

// ── Deadline Check ─────────────────────────────────────
export function isDeadlinePassed(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

export function daysUntilDeadline(deadline: string): number {
  const now = new Date();
  const dl = new Date(deadline);
  return Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Type Labels ────────────────────────────────────────
export const opportunityTypeLabels: Record<string, string> = {
  job: 'Job',
  training: 'Training',
  grant: 'Grant',
  support: 'Support',
};

export const orgTypeLabels: Record<string, string> = {
  ngo: 'NGO',
  employer: 'Employer',
  bank: 'Financial Institution',
  support: 'Business Support',
};

export const verificationLabels: Record<string, string> = {
  unverified: 'Unverified',
  pending: 'Pending Review',
  verified: 'Verified',
};

export const applicationStatusLabels: Record<string, string> = {
  applied: 'Applied',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
};

// ── Skill & Language Options ───────────────────────────
export const SKILL_OPTIONS = [
  'Construction', 'Cooking', 'Tailoring', 'Agriculture', 'Teaching',
  'Driving', 'Carpentry', 'Welding', 'Plumbing', 'Electrical',
  'Cleaning', 'Security', 'Sales', 'Marketing', 'IT',
  'Accounting', 'Healthcare', 'Childcare', 'Translation', 'Art & Craft',
  'Hairdressing', 'Mechanics', 'Painting', 'Masonry', 'Catering',
];

export const LANGUAGE_OPTIONS = [
  'English', 'French', 'Swahili', 'Luganda', 'Arabic',
  'Lingala', 'Kinyarwanda', 'Kirundi', 'Somali', 'Amharic',
  'Tigrinya', 'Oromo', 'Nuer', 'Dinka', 'Acholi',
];

export const COUNTRY_OPTIONS = [
  'Democratic Republic of Congo', 'South Sudan', 'Somalia', 'Burundi',
  'Rwanda', 'Eritrea', 'Ethiopia', 'Sudan', 'Central African Republic',
  'Other',
];

export const EDUCATION_LEVELS = [
  'No formal education', 'Primary', 'Secondary', 'Vocational/Technical',
  'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD',
];

export const KAMPALA_DISTRICTS = [
  'Kampala Central', 'Kawempe', 'Makindye', 'Nakawa', 'Rubaga',
  'Wakiso', 'Mukono', 'Other',
];
