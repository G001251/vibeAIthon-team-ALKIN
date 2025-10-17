import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Settings2, Users } from "lucide-react";

const Settings = () => {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: companySettings } = useQuery({
    queryKey: ["company_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: atsConfig } = useQuery({
    queryKey: ["ats_config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ats_config")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateAtsConfig = useMutation({
    mutationFn: async (values: { default_threshold: number; skills_keywords: string[] }) => {
      const { error } = await supabase
        .from("ats_config")
        .update(values)
        .eq("id", atsConfig?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ats_config"] });
      toast.success("ATS configuration updated successfully");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your platform preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="ats">
            <Settings2 className="h-4 w-4 mr-2" />
            ATS Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profile?.name || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile?.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div>
                  <Badge variant="secondary" className="capitalize">
                    {profile?.role || "hr"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" placeholder="Enter new password" />
                <Button className="mt-2">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button>Add User</Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                User management interface coming soon. Add, edit, and manage user roles and permissions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companySettings?.company_name || ""}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locations">Locations</Label>
                <Input
                  id="locations"
                  value={companySettings?.locations?.join(", ") || ""}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <Input id="logo" type="file" accept="image/*" />
              </div>
              <Button>Save Company Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ats">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>ATS Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Default ATS Threshold: {atsConfig?.default_threshold || 70}%</Label>
                <Slider
                  defaultValue={[atsConfig?.default_threshold || 70]}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Skills Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  placeholder="React, Node.js, Python, JavaScript..."
                  value={atsConfig?.skills_keywords?.join(", ") || ""}
                  rows={4}
                />
              </div>
              <Button
                onClick={() => {
                  updateAtsConfig.mutate({
                    default_threshold: atsConfig?.default_threshold || 70,
                    skills_keywords: atsConfig?.skills_keywords || [],
                  });
                }}
              >
                Save ATS Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
