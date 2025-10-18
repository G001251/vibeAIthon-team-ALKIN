import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Filter, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResumeUpload } from "@/components/ResumeUpload";
import { CandidateFilterBar, FilterState } from "@/components/CandidateFilterBar";
import { EnhancedCandidateCard } from "@/components/EnhancedCandidateCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HireSmart = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("overall_score");
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

  const { data: candidates, isLoading, refetch } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("overall_score", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    let filtered = candidates.filter((candidate) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `
          ${candidate.name} 
          ${candidate.email} 
          ${candidate.skills?.join(" ")} 
          ${candidate.domain}
          ${candidate.education}
          ${candidate.location}
        `.toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasSkills = filters.skills.some((skill) =>
          candidate.skills?.some((cs) => cs.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasSkills) return false;
      }

      // Experience range
      if (
        candidate.experience_years < filters.experienceMin ||
        candidate.experience_years > filters.experienceMax
      ) {
        return false;
      }

      // Domains filter
      if (filters.domains.length > 0) {
        const hasDomain = filters.domains.some((domain) =>
          candidate.project_domains?.some((pd) => pd.toLowerCase().includes(domain.toLowerCase())) ||
          candidate.domain?.toLowerCase().includes(domain.toLowerCase())
        );
        if (!hasDomain) return false;
      }

      // Department filter
      if (filters.departments.length > 0) {
        const hasDepartment = filters.departments.some((dept) =>
          candidate.education?.toLowerCase().includes(dept.toLowerCase())
        );
        if (!hasDepartment) return false;
      }

      // Score filters
      if (candidate.ats_score < filters.atsScoreMin) return false;
      if ((candidate.overall_score || candidate.ats_score) < filters.overallScoreMin) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "overall_score":
          return (b.overall_score || b.ats_score) - (a.overall_score || a.ats_score);
        case "ats_score":
          return b.ats_score - a.ats_score;
        case "experience_years":
          return b.experience_years - a.experience_years;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [candidates, filters, sortBy]);

  const handleShortlist = async (candidateId: string) => {
    const { error } = await supabase
      .from("candidates")
      .update({ status: "shortlisted" })
      .eq("id", candidateId);

    if (error) {
      toast.error("Failed to shortlist candidate");
    } else {
      toast.success("Candidate shortlisted successfully");
      refetch();
    }
  };

  const handleReject = async (candidateId: string) => {
    const { error } = await supabase
      .from("candidates")
      .update({ status: "rejected" })
      .eq("id", candidateId);

    if (error) {
      toast.error("Failed to reject candidate");
    } else {
      toast.success("Candidate rejected");
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HireSmart</h1>
          <p className="text-muted-foreground">
            Multi-Criteria Candidate Shortlisting with Advanced Scoring
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Resumes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Resumes (Up to 50 files)</DialogTitle>
            </DialogHeader>
            <ResumeUpload
              onUpload={(files) => {
                setIsUploadOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredCandidates.length} matching filters
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates?.filter((c) => c.status === "shortlisted").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Interviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates?.filter((c) => c.status === "interviewed").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {candidates && candidates.length > 0
                ? Math.round(
                    candidates.reduce(
                      (acc, c) => acc + (c.overall_score || c.ats_score),
                      0
                    ) / candidates.length
                  )
                : 0}
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filter Bar */}
      <CandidateFilterBar onFilterChange={setFilters} />

      {/* Results Header */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="text-sm">
          Found <span className="font-bold">{filteredCandidates.length}</span> candidates
          {filters.searchQuery && ` matching "${filters.searchQuery}"`}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall_score">Overall Score</SelectItem>
              <SelectItem value="ats_score">ATS Score</SelectItem>
              <SelectItem value="experience_years">Experience</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p>Loading candidates...</p>
          </div>
        ) : filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <EnhancedCandidateCard
              key={candidate.id}
              candidate={candidate}
              onShortlist={handleShortlist}
              onReject={handleReject}
              onViewResume={(id) => toast.info("Resume viewer coming soon")}
            />
          ))
        ) : (
          <Card className="col-span-full shadow-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {candidates && candidates.length > 0
                  ? "No candidates match your filters. Try adjusting your search criteria."
                  : "No candidates found. Upload resumes to get started."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HireSmart;
