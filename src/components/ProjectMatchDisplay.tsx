import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { User, Mail, Briefcase, GraduationCap, Award, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectMatchDisplayProps {
  projectId: string;
  onClose: () => void;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience_years: number;
  education: string;
  domain: string;
  project_domains: string[];
  overall_score: number;
}

interface Match {
  candidate: Candidate;
  match_score: number;
  skills_score: number;
  experience_score: number;
  domain_score: number;
  education_score: number;
  availability_score: number;
  status: string;
}

export function ProjectMatchDisplay({ projectId, onClose }: ProjectMatchDisplayProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const queryClient = useQueryClient();

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: candidates } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("status", "shortlisted");
      if (error) throw error;
      return data as Candidate[];
    },
  });

  const calculateMatches = () => {
    if (!project || !candidates) return;

    setIsCalculating(true);

    const calculatedMatches = candidates
      .map((candidate) => {
        // Skills match (35%)
        const requiredSkills = project.required_skills || [];
        const candidateSkills = candidate.skills || [];
        const matchingSkills = requiredSkills.filter((skill) =>
          candidateSkills.some((cs) => cs.toLowerCase().includes(skill.toLowerCase()))
        );
        const skillsScore = requiredSkills.length > 0
          ? (matchingSkills.length / requiredSkills.length) * 100
          : 0;

        // Experience match (25%)
        const experienceYears = candidate.experience_years || 0;
        let experienceScore = 0;
        const expLevel = project.experience_level || "";
        if (expLevel.includes("Junior")) {
          experienceScore = experienceYears >= 0 && experienceYears <= 2 ? 100 : Math.max(0, 100 - Math.abs(experienceYears - 1) * 20);
        } else if (expLevel.includes("Mid-level")) {
          experienceScore = experienceYears >= 2 && experienceYears <= 5 ? 100 : Math.max(0, 100 - Math.abs(experienceYears - 3.5) * 20);
        } else if (expLevel.includes("Senior")) {
          experienceScore = experienceYears >= 5 ? 100 : Math.max(0, experienceYears * 20);
        } else if (expLevel.includes("Lead")) {
          experienceScore = experienceYears >= 8 ? 100 : Math.max(0, experienceYears * 12.5);
        }

        // Project domain match (20%)
        const projectType = project.type?.toLowerCase() || "";
        const candidateDomains = (candidate.project_domains || []).map((d) => d.toLowerCase());
        const domainScore = candidateDomains.some((d) => projectType.includes(d) || d.includes(projectType))
          ? 100
          : candidateDomains.length > 0 ? 50 : 0;

        // Education match (10%)
        const education = candidate.education?.toLowerCase() || "";
        const educationScore =
          education.includes("computer") ||
          education.includes("engineering") ||
          education.includes("tech")
            ? 100
            : education.includes("bachelor") || education.includes("master")
            ? 70
            : 50;

        // Availability (10%) - assume all shortlisted candidates are available
        const availabilityScore = 100;

        // Calculate final weighted score
        const matchScore = Math.round(
          skillsScore * 0.35 +
          experienceScore * 0.25 +
          domainScore * 0.2 +
          educationScore * 0.1 +
          availabilityScore * 0.1
        );

        return {
          candidate,
          match_score: matchScore,
          skills_score: Math.round(skillsScore),
          experience_score: Math.round(experienceScore),
          domain_score: Math.round(domainScore),
          education_score: Math.round(educationScore),
          availability_score: Math.round(availabilityScore),
          status: "suggested",
        };
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10);

    setMatches(calculatedMatches);
    setIsCalculating(false);
  };

  useEffect(() => {
    if (project && candidates) {
      calculateMatches();
    }
  }, [project, candidates]);

  const assignMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      const match = matches.find((m) => m.candidate.id === candidateId);
      if (!match) throw new Error("Match not found");

      const { error } = await supabase.from("project_matches").upsert({
        project_id: projectId,
        candidate_id: candidateId,
        match_score: match.match_score,
        skills_score: match.skills_score,
        experience_score: match.experience_score,
        domain_score: match.domain_score,
        education_score: match.education_score,
        availability_score: match.availability_score,
        status: "assigned",
        assigned_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Update project employees_assigned
      const currentProject = await supabase
        .from("projects")
        .select("employees_assigned")
        .eq("id", projectId)
        .single();

      if (currentProject.data) {
        await supabase
          .from("projects")
          .update({
            employees_assigned: (currentProject.data.employees_assigned || 0) + 1,
          })
          .eq("id", projectId);
      }
    },
    onSuccess: () => {
      toast.success("Candidate assigned to project successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Error assigning candidate:", error);
      toast.error("Failed to assign candidate");
    },
  });

  const getMatchColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getMatchBadge = (score: number) => {
    if (score >= 85) return { text: "Excellent Match", variant: "default" as const };
    if (score >= 70) return { text: "Good Match", variant: "secondary" as const };
    return { text: "Fair Match", variant: "outline" as const };
  };

  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-sm text-muted-foreground">{project.client_name}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList>
          <TabsTrigger value="matches">Top Matches ({matches.length})</TabsTrigger>
          <TabsTrigger value="assigned">Assigned (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4 mt-4">
          {isCalculating ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Calculating matches...</p>
              </CardContent>
            </Card>
          ) : matches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No matching candidates found</p>
              </CardContent>
            </Card>
          ) : (
            matches.map((match) => {
              const badge = getMatchBadge(match.match_score);
              return (
                <Card key={match.candidate.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-xl">{match.candidate.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {match.candidate.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getMatchColor(match.match_score)}`}>
                          {match.match_score}%
                        </p>
                        <Badge variant={badge.variant}>{badge.text}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Skills Match</span>
                          <span className="font-medium">{match.skills_score}%</span>
                        </div>
                        <Progress value={match.skills_score} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Experience Match</span>
                          <span className="font-medium">{match.experience_score}%</span>
                        </div>
                        <Progress value={match.experience_score} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Domain Match</span>
                          <span className="font-medium">{match.domain_score}%</span>
                        </div>
                        <Progress value={match.domain_score} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Education Match</span>
                          <span className="font-medium">{match.education_score}%</span>
                        </div>
                        <Progress value={match.education_score} />
                      </div>
                    </div>

                    <div className="grid gap-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Experience:</span>
                        <span>{match.candidate.experience_years} years</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Education:</span>
                        <span>{match.candidate.education || "Not specified"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Domain:</span>
                        <span>{match.candidate.domain || "General"}</span>
                      </div>
                    </div>

                    {match.candidate.skills && match.candidate.skills.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium mb-2">Key Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.candidate.skills.slice(0, 8).map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        onClick={() => assignMutation.mutate(match.candidate.id)}
                        disabled={assignMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Assign to Project
                      </Button>
                      <Button variant="outline" className="flex-1">
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="assigned">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No candidates assigned yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
