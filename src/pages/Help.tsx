import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HelpCircle, Mail, Users as UsersIcon } from "lucide-react";

const Help = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  const faqItems = [
    {
      question: "How do I upload resumes to HireSmart?",
      answer: "Go to the HireSmart page and click 'Upload Resumes'. You can drag and drop PDF or DOCX files, or click to select them. The system will automatically parse candidate information and calculate ATS scores."
    },
    {
      question: "What is an ATS score?",
      answer: "ATS (Applicant Tracking System) score measures how well a candidate's resume matches job requirements. Scores range from 0-100%, calculated based on skills match, experience, and other factors. Higher scores indicate better matches."
    },
    {
      question: "How does AutoMatch work?",
      answer: "AutoMatch uses AI to analyze project requirements and match them with available employees. It considers skills overlap (60%), experience level (25%), and availability (15%) to recommend the best team members for each project."
    },
    {
      question: "How do I predict salaries?",
      answer: "Navigate to Salary Analysis, fill in the job details (role, skills, experience, location, industry, company size), and click 'Predict Salary'. The system uses market data and algorithms to provide min-ideal-max salary ranges."
    },
    {
      question: "What are the different user roles and permissions?",
      answer: "Admin: Full access to all features. HR: Can manage candidates, employees, and projects. Team Lead: Can view team data and manage assigned projects. CEO: View aggregated analytics. Investor: Limited view of metrics."
    },
    {
      question: "How do I add new employees to the system?",
      answer: "Go to Settings > User Management (admin only) to add new users. When hiring a candidate, you can convert them to an employee from the HireSmart candidate details page."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Information</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Describe your issue or question..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-primary" />
                About Humanet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">Humanet HR Intelligence Platform</strong> is
                an AI-powered solution for modern HR management, developed for VibeAIthon at Kingston College.
              </p>
              <p>
                Our platform combines advanced analytics, automated screening, intelligent matching,
                and predictive insights to streamline your hiring and team management processes.
              </p>
              <div className="pt-4 space-y-2 border-t">
                <p className="text-sm">
                  <strong className="text-foreground">Version:</strong> 1.0.0
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">Developed by:</strong> Kingston College Team
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">Hackathon:</strong> VibeAIthon 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
