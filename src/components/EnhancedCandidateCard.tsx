import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Code,
  Briefcase,
  Clock,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills?: string[];
  experience_years: number;
  expected_ctc?: number;
  current_ctc?: number;
  domain?: string;
  education?: string;
  status: string;
  ats_score: number;
  skills_score?: number;
  projects_score?: number;
  experience_score?: number;
  education_score?: number;
  overall_score?: number;
  project_domains?: string[];
}

interface EnhancedCandidateCardProps {
  candidate: Candidate;
  onShortlist?: (id: string) => void;
  onReject?: (id: string) => void;
  onViewResume?: (id: string) => void;
}

export function EnhancedCandidateCard({
  candidate,
  onShortlist,
  onReject,
  onViewResume,
}: EnhancedCandidateCardProps) {
  const overallScore = candidate.overall_score || candidate.ats_score;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Excellent", variant: "default" as const, color: "bg-success" };
    if (score >= 60) return { text: "Good", variant: "secondary" as const, color: "bg-warning" };
    return { text: "Fair", variant: "outline" as const, color: "bg-destructive" };
  };

  const scoreBadge = getScoreBadge(overallScore);

  return (
    <Card className="shadow-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{candidate.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Mail className="h-3 w-3" />
              <span>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{candidate.phone}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {Math.round(overallScore)}
            </div>
            <Badge className={scoreBadge.color}>
              {scoreBadge.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>ATS Score</span>
              </div>
              <span className="font-medium">{candidate.ats_score}%</span>
            </div>
            <Progress value={candidate.ats_score} className="h-1.5" />
          </div>

          {candidate.skills_score !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  <span>Skills Match</span>
                </div>
                <span className="font-medium">{Math.round(candidate.skills_score)}%</span>
              </div>
              <Progress value={candidate.skills_score} className="h-1.5" />
            </div>
          )}

          {candidate.projects_score !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span>Projects</span>
                </div>
                <span className="font-medium">{Math.round(candidate.projects_score)}%</span>
              </div>
              <Progress value={candidate.projects_score} className="h-1.5" />
            </div>
          )}

          {candidate.experience_score !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Experience</span>
                </div>
                <span className="font-medium">{Math.round(candidate.experience_score)}%</span>
              </div>
              <Progress value={candidate.experience_score} className="h-1.5" />
            </div>
          )}
        </div>

        {/* Key Information */}
        <div className="space-y-2 text-sm">
          {candidate.experience_years !== undefined && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{candidate.experience_years} years experience</span>
            </div>
          )}
          {candidate.education && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>{candidate.education}</span>
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{candidate.location}</span>
            </div>
          )}
          {candidate.expected_ctc && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">Expected CTC:</span>
              <span>₹{candidate.expected_ctc}L</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-2">Key Skills</div>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 8).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Project Domains */}
        {candidate.project_domains && candidate.project_domains.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-2">Project Experience</div>
            <div className="flex flex-wrap gap-1">
              {candidate.project_domains.slice(0, 4).map((domain, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="pt-2">
          <Badge variant="outline" className="capitalize">
            {candidate.status}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onViewResume && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewResume(candidate.id)}
              className="flex-1 gap-2"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </Button>
          )}
          {onShortlist && candidate.status === "new" && (
            <Button
              size="sm"
              onClick={() => onShortlist(candidate.id)}
              className="flex-1 gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Shortlist
            </Button>
          )}
          {onReject && candidate.status === "new" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(candidate.id)}
              className="flex-1 gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
