-- Enhance projects table with additional fields
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS client_name text,
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS experience_level text,
ADD COLUMN IF NOT EXISTS employees_needed integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS employees_assigned integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_range text,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS remote_type text DEFAULT 'remote',
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS additional_notes text;

-- Create project_matches table for tracking AI matches
CREATE TABLE IF NOT EXISTS public.project_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  match_score numeric NOT NULL DEFAULT 0,
  skills_score numeric DEFAULT 0,
  experience_score numeric DEFAULT 0,
  domain_score numeric DEFAULT 0,
  education_score numeric DEFAULT 0,
  availability_score numeric DEFAULT 0,
  status text DEFAULT 'suggested',
  assigned_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, candidate_id)
);

-- Enable RLS on project_matches
ALTER TABLE public.project_matches ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_matches
CREATE POLICY "Authenticated users can view matches"
ON public.project_matches
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "HR, Admin, Team Lead can manage matches"
ON public.project_matches
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'hr', 'team_lead')
  )
);

-- Insert 8 sample projects
INSERT INTO public.projects (
  title, client_name, type, description, required_skills, experience_level,
  employees_needed, start_date, end_date, budget_range, priority, remote_type,
  location, status, timeline, progress_percentage
) VALUES
(
  'E-Commerce Platform Redesign',
  'ShopEasy Inc.',
  'Web Development',
  'Complete redesign of existing e-commerce platform with new UI/UX and payment gateway integration',
  ARRAY['React', 'Node.js', 'MongoDB', 'AWS', 'TailwindCSS'],
  'Senior (5+ years)',
  3,
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '4 months',
  '$50K-$100K',
  'high',
  'remote',
  NULL,
  'active',
  '4 months',
  0
),
(
  'Mobile Banking App',
  'FinTech Solutions',
  'Mobile App',
  'Build secure mobile banking app with biometric authentication and real-time transactions',
  ARRAY['React Native', 'Firebase', 'Swift', 'Kotlin'],
  'Mid-level (3-5 years)',
  2,
  CURRENT_DATE + INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '6 months',
  '$50K-$100K',
  'urgent',
  'hybrid',
  'New York',
  'active',
  '6 months',
  0
),
(
  'AI Chatbot Development',
  'CustomerCare Pro',
  'AI/ML',
  'Develop intelligent chatbot with natural language processing for customer support automation',
  ARRAY['Python', 'TensorFlow', 'NLP', 'FastAPI', 'Docker'],
  'Senior (5+ years)',
  2,
  CURRENT_DATE + INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '3 months',
  '$50K-$100K',
  'high',
  'remote',
  NULL,
  'active',
  '3 months',
  0
),
(
  'Cloud Migration Project',
  'Legacy Systems Corp',
  'Cloud Infrastructure',
  'Migrate on-premise infrastructure to AWS cloud with zero downtime',
  ARRAY['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
  'Senior (5+ years)',
  4,
  CURRENT_DATE + INTERVAL '21 days',
  CURRENT_DATE + INTERVAL '8 months',
  '$100K+',
  'medium',
  'hybrid',
  'San Francisco',
  'active',
  '8 months',
  0
),
(
  'Data Analytics Dashboard',
  'Marketing Metrics Inc',
  'Data Analytics',
  'Build interactive dashboard for marketing analytics with real-time data visualization',
  ARRAY['Python', 'SQL', 'Tableau', 'Power BI', 'pandas'],
  'Mid-level (3-5 years)',
  2,
  CURRENT_DATE + INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '3 months',
  '$10K-$50K',
  'medium',
  'remote',
  NULL,
  'active',
  '3 months',
  0
),
(
  'Inventory Management System',
  'Warehouse Solutions',
  'Web Development',
  'Develop comprehensive inventory tracking system with barcode scanning and reporting',
  ARRAY['React', 'Django', 'PostgreSQL', 'REST API'],
  'Mid-level (2-5 years)',
  2,
  CURRENT_DATE + INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '4 months',
  '$50K-$100K',
  'high',
  'remote',
  NULL,
  'active',
  '4 months',
  0
),
(
  'Healthcare Portal',
  'MediConnect',
  'Web Development',
  'HIPAA-compliant patient portal with appointment scheduling and telemedicine features',
  ARRAY['React', 'Node.js', 'MongoDB', 'HIPAA Compliance', 'WebSockets'],
  'Senior (5+ years)',
  3,
  CURRENT_DATE + INTERVAL '1 day',
  CURRENT_DATE + INTERVAL '6 months',
  '$100K+',
  'urgent',
  'hybrid',
  'Boston',
  'active',
  '6 months',
  0
),
(
  'Blockchain Voting System',
  'Gov Tech Innovations',
  'Blockchain',
  'Secure blockchain-based voting system with smart contracts and transparent audit trails',
  ARRAY['Solidity', 'Web3.js', 'React', 'Ethereum', 'Smart Contracts'],
  'Senior (5+ years)',
  2,
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '5 months',
  '$50K-$100K',
  'medium',
  'remote',
  NULL,
  'active',
  '5 months',
  0
);