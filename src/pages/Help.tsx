import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I upload resumes?</AccordionTrigger>
              <AccordionContent>
                Navigate to the HireSmart page and click the "Upload Resumes" button.
                You can drag and drop PDF or DOCX files, or click to browse. The
                system will automatically parse and score the resumes using ATS.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What is ATS score?</AccordionTrigger>
              <AccordionContent>
                ATS (Applicant Tracking System) score is a percentage that indicates
                how well a candidate's resume matches the job requirements. Scores
                above 80% are excellent, 60-79% are good, and below 60% need review.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How does AutoMatch work?</AccordionTrigger>
              <AccordionContent>
                AutoMatch uses AI to analyze project requirements and employee skills,
                experience, and availability. It provides match scores and
                recommendations to help you build the perfect team for each project.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How accurate are salary predictions?</AccordionTrigger>
              <AccordionContent>
                Salary predictions are based on multiple factors including role, skills,
                experience, location, industry, and company size. The system provides a
                confidence score with each prediction, typically ranging from 70-95%.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>About Humanet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Humanet is an HR Intelligence Platform built for the VibeAIthon Hackathon
            at Kingston Engineering College, Coimbatore.
          </p>
          <p className="text-muted-foreground">
            Our platform unifies resume screening, employee-project matching, salary
            prediction, and executive analytics in one comprehensive system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
