-- Add new scoring columns to candidates table
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS skills_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS experience_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS education_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS overall_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS project_domains TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS positions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS institution TEXT,
ADD COLUMN IF NOT EXISTS graduation_year INTEGER;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_candidates_skills ON candidates USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_candidates_project_domains ON candidates USING GIN(project_domains);
CREATE INDEX IF NOT EXISTS idx_candidates_overall_score ON candidates(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_domain ON candidates(domain);

-- Add comment for documentation
COMMENT ON COLUMN candidates.skills_score IS 'Skills match score (0-100)';
COMMENT ON COLUMN candidates.projects_score IS 'Project experience score (0-100)';
COMMENT ON COLUMN candidates.experience_score IS 'Experience score (0-100)';
COMMENT ON COLUMN candidates.education_score IS 'Education relevance score (0-100)';
COMMENT ON COLUMN candidates.overall_score IS 'Overall weighted score: ATS(30%) + Skills(25%) + Projects(20%) + Experience(15%) + Education(10%)';