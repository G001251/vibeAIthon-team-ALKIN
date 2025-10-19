import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const projectSchema = z.object({
  title: z.string().min(3, "Project name must be at least 3 characters"),
  client_name: z.string().min(2, "Client name is required"),
  type: z.string().min(1, "Project type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  experience_level: z.string().min(1, "Experience level is required"),
  employees_needed: z.coerce.number().min(1, "At least 1 employee needed"),
  start_date: z.date({ required_error: "Start date is required" }),
  end_date: z.date({ required_error: "End date is required" }),
  budget_range: z.string().min(1, "Budget range is required"),
  priority: z.string().min(1, "Priority is required"),
  remote_type: z.string().min(1, "Remote type is required"),
  location: z.string().optional(),
  additional_notes: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const projectTypes = [
  "Web Development",
  "Mobile App",
  "AI/ML",
  "Cloud Infrastructure",
  "Data Analytics",
  "Blockchain",
  "IoT",
  "DevOps",
  "Cybersecurity",
  "Enterprise Software",
];

const experienceLevels = [
  "Junior (0-2 years)",
  "Mid-level (2-5 years)",
  "Senior (5+ years)",
  "Lead (8+ years)",
];

const budgetRanges = ["<$10K", "$10K-$50K", "$50K-$100K", "$100K+"];

const priorities = ["low", "medium", "high", "urgent"];

const remoteTypes = ["remote", "hybrid", "onsite"];

const commonSkills = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "AWS",
  "Docker",
  "Kubernetes",
  "MongoDB",
  "PostgreSQL",
  "React Native",
  "Swift",
  "Kotlin",
  "TensorFlow",
  "Django",
  "Flask",
  "FastAPI",
  "Vue.js",
  "Angular",
  "Go",
  "Rust",
  "C++",
  "Terraform",
  "Jenkins",
  "GraphQL",
  "REST API",
  "Solidity",
  "Web3.js",
  "Ethereum",
];

export function ProjectCreationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      employees_needed: 1,
      priority: "medium",
      remote_type: "remote",
    },
  });

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (selectedSkills.length === 0) {
        toast.error("Please select at least one required skill");
        return;
      }

      const timeline = `${Math.ceil(
        (data.end_date.getTime() - data.start_date.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )} months`;

      const { error } = await supabase.from("projects").insert({
        title: data.title,
        client_name: data.client_name,
        type: data.type,
        description: data.description,
        required_skills: selectedSkills,
        experience_level: data.experience_level,
        employees_needed: data.employees_needed,
        employees_assigned: 0,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        end_date: format(data.end_date, "yyyy-MM-dd"),
        budget_range: data.budget_range,
        priority: data.priority,
        remote_type: data.remote_type,
        location: data.location || null,
        additional_notes: data.additional_notes || null,
        status: "active",
        timeline,
        progress_percentage: 0,
      });

      if (error) throw error;

      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      setSelectedSkills([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="E-Commerce Platform" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level Required</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project requirements, goals, and key deliverables..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Required Skills</FormLabel>
          <div className="space-y-3 mt-2">
            <div className="flex gap-2">
              <Select onValueChange={addSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select skills..." />
                </SelectTrigger>
                <SelectContent>
                  {commonSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 flex-1">
                <Input
                  placeholder="Or add custom skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                />
                <Button type="button" onClick={addCustomSkill} variant="outline">
                  Add
                </Button>
              </div>
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="employees_needed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employees Needed</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < (form.getValues("start_date") || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="remote_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {remoteTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (if not fully remote)</FormLabel>
                <FormControl>
                  <Input placeholder="New York, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional requirements or preferences..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Project
        </Button>
      </form>
    </Form>
  );
}
