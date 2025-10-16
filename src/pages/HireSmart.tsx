import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Filter } from "lucide-react";
import { toast } from "sonner";

const HireSmart = () => {
  const [atsThreshold, setAtsThreshold] = useState(70);

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["candidates", atsThreshold],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .gte("ats_score", atsThreshold)
        .order("ats_score", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-success text-success-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HireSmart</h1>
          <p className="text-muted-foreground">
            Intelligent Resume Screening with ATS Scoring
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Resumes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates?.length || 0}</div>
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
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates?.filter((c) => c.status === "hired").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ATS Score Threshold: {atsThreshold}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="range"
            min="60"
            max="90"
            value={atsThreshold}
            onChange={(e) => setAtsThreshold(Number(e.target.value))}
            className="w-full"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading candidates...</p>
        ) : candidates && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <Card key={candidate.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <Badge className={getScoreBadgeColor(candidate.ats_score)}>
                    {candidate.ats_score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {candidate.skills?.slice(0, 5).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{candidate.experience_years} years experience</p>
                  <p>Expected: ₹{candidate.expected_ctc}L</p>
                  <p>{candidate.location}</p>
                </div>
                <Badge variant="outline">{candidate.status}</Badge>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full shadow-card">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No candidates found. Upload resumes to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HireSmart;
