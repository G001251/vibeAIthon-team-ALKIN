import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const SalaryAnalysis = () => {
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = () => {
    // Mock prediction for demo
    setPrediction({
      min: 8.5,
      ideal: 10,
      max: 11.5,
      confidence: 87,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salary Analysis</h1>
        <p className="text-muted-foreground">
          Market Compensation Intelligence for Emerging Roles
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Prediction Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role Title</Label>
              <Input id="role" placeholder="e.g., AI Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input id="experience" type="number" placeholder="3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="coimbatore">Coimbatore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="tech">IT/Tech</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-size">Company Size</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="mid">Mid-Size</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePredict} className="w-full">
              Predict Salary
            </Button>
          </CardContent>
        </Card>

        {prediction && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gradient-primary p-6 text-center text-primary-foreground">
                <p className="text-sm font-medium">Predicted Salary Range</p>
                <p className="mt-2 text-3xl font-bold">
                  ₹{prediction.min}L - ₹{prediction.max}L
                </p>
                <p className="mt-1 text-sm opacity-90">per annum</p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-accent/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Ideal Offer</p>
                  <p className="text-2xl font-bold text-accent">
                    ₹{prediction.ideal}L
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                  <span className="text-sm font-medium">Confidence</span>
                  <Badge className="bg-success text-success-foreground">
                    {prediction.confidence}%
                  </Badge>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <p className="text-sm font-medium">Regional Comparison</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coimbatore</span>
                      <span className="font-medium">₹7.0L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chennai</span>
                      <span className="font-medium">₹9.0L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bangalore</span>
                      <span className="font-medium">₹12.0L</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalaryAnalysis;
