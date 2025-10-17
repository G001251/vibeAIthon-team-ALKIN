import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";

const Analytics = () => {
  const { data: stats } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: async () => {
      const [candidatesRes, employeesRes, projectsRes] = await Promise.all([
        supabase.from("candidates").select("*", { count: "exact" }),
        supabase.from("employees").select("*", { count: "exact" }),
        supabase.from("projects").select("*", { count: "exact" }),
      ]);

      return {
        totalCandidates: candidatesRes.count || 0,
        totalEmployees: employeesRes.count || 0,
        totalProjects: projectsRes.count || 0,
        activeProjects: candidatesRes.data?.filter((c: any) => c.status === "active").length || 0,
      };
    },
  });

  const hiringFunnelData = [
    { name: "Applied", value: stats?.totalCandidates || 0 },
    { name: "Screened", value: Math.floor((stats?.totalCandidates || 0) * 0.7) },
    { name: "Interviewed", value: Math.floor((stats?.totalCandidates || 0) * 0.4) },
    { name: "Offered", value: Math.floor((stats?.totalCandidates || 0) * 0.2) },
    { name: "Hired", value: Math.floor((stats?.totalCandidates || 0) * 0.15) },
  ];

  const projectStatusData = [
    { name: "Active", value: 8, color: "hsl(var(--primary))" },
    { name: "Completed", value: 12, color: "hsl(var(--success))" },
    { name: "On Hold", value: 3, color: "hsl(var(--warning))" },
  ];

  const employeeDistributionData = [
    { location: "Coimbatore", count: 45 },
    { location: "Chennai", count: 62 },
    { location: "Bangalore", count: 78 },
    { location: "Hyderabad", count: 54 },
    { location: "Mumbai", count: 38 },
  ];

  const salaryTrendData = [
    { month: "Jan", amount: 2500000 },
    { month: "Feb", amount: 2700000 },
    { month: "Mar", amount: 2900000 },
    { month: "Apr", amount: 3100000 },
    { month: "May", amount: 3300000 },
    { month: "Jun", amount: 3500000 },
  ];

  const statCards = [
    { title: "Total Employees", value: stats?.totalEmployees || 0, icon: Users, color: "text-primary" },
    { title: "Active Projects", value: stats?.activeProjects || 0, icon: Briefcase, color: "text-accent" },
    { title: "Hiring This Month", value: 24, icon: TrendingUp, color: "text-warning" },
    { title: "Avg Time-to-Hire", value: "18 days", icon: Clock, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Detailed insights and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hiringFunnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Employee Distribution by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Salary Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
