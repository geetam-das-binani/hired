export type Jobs = {
  location?: string;
  company_id?: string;
  searchQuery?: string;
};

export type SingleJobType = {
  id: number;
  title: string;
  description: string;
  location: string;
  company_id: number;
  requirements: string;
  isOpen: boolean;
  created_at: string;
  recruiter_id: string;
  
  company: {
    name: string;
    logo_url: string;
  };
  saved: Array<{ id: number }>;
  applications: Array<{
    id: number;
    user_id: string;
    job_id: number;
    created_at: Date;
    name: string;
    skills: string;
    resume: string;
    education: string;
    experience: string;
    status: string;
    candidate_id: string;
  }>;
};

export type CompanyType = {
  id: string;
  created_at: Date;
  name: string;
  logo_url: string;
};


export type ApplicationType = {
  id?: number;
  user_id: string;
  job_id: number;
  created_at: Date;
  name: string;
  skills: string;
  resume: string;
  education: string;
  experience: string;
  status: string;
  candidate_id: string;
};
