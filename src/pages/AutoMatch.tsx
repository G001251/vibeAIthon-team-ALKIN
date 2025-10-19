import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Search, Filter, TrendingUp, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCreationForm } from "@/components/ProjectCreationForm";
import { ProjectMatchDisplay } from "@/components/ProjectMatchDisplay";

const AutoMatch = () => {
  const [selectedTab, setSelectedTab] = useState("active");
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-success text-success-foreground";
    if (status === "on-hold") return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "urgent") return "bg-destructive text-destructive-foreground";
    if (priority === "high") return "bg-warning text-warning-foreground";
    if (priority === "medium") return "bg-primary text-primary-foreground";
    return "bg-muted text-muted-foreground";
  };

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.required_skills?.some((skill: string) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    const matchesPriority = filterPriority === "all" || project.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter((p) => p.status === "active").length || 0;
  const totalMatched = projects?.reduce((sum, p) => sum + (p.employees_assigned || 0), 0) || 0;
  const totalNeeded = projects?.reduce((sum, p) => sum + (p.employees_needed || 0), 0) || 0;
  const successRate = totalNeeded > 0 ? Math.round((totalMatched / totalNeeded) * 100) : 0;

  if (selectedProject) {
    return (
      <ProjectMatchDisplay
        projectId={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AutoMatch</h1>
          <p className="text-muted-foreground">
            AI-Powered Project-Employee Assignment
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          {showForm ? "Cancel" : "Create Project"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Matched Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMatched} / {totalNeeded}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
          </CardContent>
        </Card>
      </div>

      {showForm ? (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectCreationForm onSuccess={() => setShowForm(false)} />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by project name, client, or skills..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {isLoading ? (
              <p>Loading projects...</p>
            ) : filteredProjects && filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card key={project.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge className={getPriorityColor(project.priority || "medium")}>
                            {project.priority || "medium"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.client_name} • {project.type}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.required_skills?.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Experience Level</p>
                        <p className="font-medium">{project.experience_level}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="font-medium">
                          {project.employees_assigned || 0} / {project.employees_needed}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium">{project.budget_range}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timeline</p>
                        <p className="font-medium">{project.timeline}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {project.progress_percentage}%
                        </span>
                      </div>
                      <Progress value={project.progress_percentage} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Find Matches
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== "all" || filterPriority !== "all"
                      ? "No projects match your filters"
                      : "No projects yet. Create your first project to get started."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AutoMatch;
