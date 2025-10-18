import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  domains: string[];
  atsScoreMin: number;
  departments: string[];
  overallScoreMin: number;
}

const COMMON_SKILLS = [
  "React", "Node.js", "Python", "JavaScript", "TypeScript",
  "Java", "SQL", "MongoDB", "AWS", "Docker", "Kubernetes",
  "Angular", "Vue.js", "Express.js", "Django", "Flask",
  "PostgreSQL", "MySQL", "Redis", "GraphQL", "REST API"
];

const PROJECT_DOMAINS = [
  "Web Development", "Mobile Development", "AI/ML", "Cloud Computing",
  "DevOps", "Data Science", "Blockchain", "IoT", "Cybersecurity",
  "E-commerce", "Finance", "Healthcare", "Education"
];

const DEPARTMENTS = [
  "Computer Science", "Software Engineering", "Information Technology",
  "Electronics", "Electrical Engineering", "Mechanical Engineering",
  "Business Administration", "Data Science"
];

export function CandidateFilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    skills: [],
    experienceMin: 0,
    experienceMax: 20,
    domains: [],
    atsScoreMin: 0,
    departments: [],
    overallScoreMin: 0,
  });

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      searchQuery: "",
      skills: [],
      experienceMin: 0,
      experienceMax: 20,
      domains: [],
      atsScoreMin: 0,
      departments: [],
      overallScoreMin: 0,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    updateFilters({ skills: newSkills });
  };

  const toggleDomain = (domain: string) => {
    const newDomains = filters.domains.includes(domain)
      ? filters.domains.filter((d) => d !== domain)
      : [...filters.domains, domain];
    updateFilters({ domains: newDomains });
  };

  const toggleDepartment = (dept: string) => {
    const newDepts = filters.departments.includes(dept)
      ? filters.departments.filter((d) => d !== dept)
      : [...filters.departments, dept];
    updateFilters({ departments: newDepts });
  };

  const activeFilterCount = 
    filters.skills.length + 
    filters.domains.length + 
    filters.departments.length +
    (filters.experienceMin > 0 || filters.experienceMax < 20 ? 1 : 0) +
    (filters.atsScoreMin > 0 ? 1 : 0) +
    (filters.overallScoreMin > 0 ? 1 : 0);

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border shadow-card">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by skills, role, experience, name..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={activeFilterCount === 0}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Skills Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Skills {filters.skills.length > 0 && `(${filters.skills.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto bg-background">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Select Skills</h4>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={filters.skills.includes(skill)}
                      onCheckedChange={() => toggleSkill(skill)}
                    />
                    <label htmlFor={skill} className="text-sm cursor-pointer">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Experience Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Experience: {filters.experienceMin}-{filters.experienceMax}+ years
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-background">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Experience Range (Years)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.experienceMin} years</span>
                  <span>{filters.experienceMax}+ years</span>
                </div>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={[filters.experienceMin, filters.experienceMax]}
                  onValueChange={([min, max]) => 
                    updateFilters({ experienceMin: min, experienceMax: max })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ experienceMin: 0, experienceMax: 1 })}
                >
                  Fresher
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ experienceMin: 1, experienceMax: 3 })}
                >
                  1-3
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ experienceMin: 3, experienceMax: 5 })}
                >
                  3-5
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ experienceMin: 5, experienceMax: 10 })}
                >
                  5-10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ experienceMin: 10, experienceMax: 20 })}
                >
                  10+
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Project Domains */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Domains {filters.domains.length > 0 && `(${filters.domains.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto bg-background">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Project Domains</h4>
              <div className="space-y-2">
                {PROJECT_DOMAINS.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Checkbox
                      id={domain}
                      checked={filters.domains.includes(domain)}
                      onCheckedChange={() => toggleDomain(domain)}
                    />
                    <label htmlFor={domain} className="text-sm cursor-pointer">
                      {domain}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Department/Education */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Department {filters.departments.length > 0 && `(${filters.departments.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto bg-background">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Education Department</h4>
              <div className="space-y-2">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={dept}
                      checked={filters.departments.includes(dept)}
                      onCheckedChange={() => toggleDepartment(dept)}
                    />
                    <label htmlFor={dept} className="text-sm cursor-pointer">
                      {dept}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Score Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              Score Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-background">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Overall Score (Min)</h4>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[filters.overallScoreMin]}
                  onValueChange={([value]) => updateFilters({ overallScoreMin: value })}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{filters.overallScoreMin}+</span>
                  <span>100</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">ATS Score (Min)</h4>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[filters.atsScoreMin]}
                  onValueChange={([value]) => updateFilters({ atsScoreMin: value })}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>{filters.atsScoreMin}+</span>
                  <span>100</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ overallScoreMin: 80, atsScoreMin: 80 })}
                >
                  High (80+)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ overallScoreMin: 60, atsScoreMin: 60 })}
                >
                  Medium (60+)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFilters({ overallScoreMin: 0, atsScoreMin: 0 })}
                >
                  All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSkill(skill)}
              />
            </Badge>
          ))}
          {filters.domains.map((domain) => (
            <Badge key={domain} variant="secondary" className="gap-1">
              {domain}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleDomain(domain)}
              />
            </Badge>
          ))}
          {filters.departments.map((dept) => (
            <Badge key={dept} variant="secondary" className="gap-1">
              {dept}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleDepartment(dept)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
