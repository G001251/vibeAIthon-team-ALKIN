import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, UserCheck, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [candidates, employees, projects, shortlisted] = await Promise.all([
        supabase.from("candidates").select("id", { count: "exact", head: true }),
        supabase.from("employees").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase
          .from("candidates")
          .select("id", { count: "exact", head: true })
          .eq("status", "shortlisted"),
      ]);

      return {
        candidates: candidates.count || 0,
        employees: employees.count || 0,
        projects: projects.count || 0,
        shortlisted: shortlisted.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.employees || 0,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Projects",
      value: stats?.projects || 0,
      icon: Briefcase,
      color: "text-accent",
    },
    {
      title: "Candidates",
      value: stats?.candidates || 0,
      icon: UserCheck,
      color: "text-warning",
    },
    {
      title: "Shortlisted",
      value: stats?.shortlisted || 0,
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your HR Intelligence Platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/hire-smart">Upload Resumes</a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/auto-match">Create New Project</a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/salary-analysis">Predict Salary</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-success" />
                <p className="text-muted-foreground">System ready for use</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <p className="text-muted-foreground">
                  Upload resumes to get started with HireSmart
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <p className="text-muted-foreground">
                  Create your first project in AutoMatch
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";

export default Dashboard;
