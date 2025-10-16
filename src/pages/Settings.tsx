import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your platform preferences
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Settings panel coming soon. This will include user management, company
            settings, and ATS configuration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
