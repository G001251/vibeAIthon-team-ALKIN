import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ResumeUploadProps {
  onUpload: (files: File[]) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf" || file.name.endsWith(".docx")
    );

    if (validFiles.length !== acceptedFiles.length) {
      toast.error("Some files were rejected. Only PDF and DOCX files are allowed.");
    }

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > 50) {
      toast.error(`You can only upload up to 50 resumes at once. Current: ${files.length}, Attempting to add: ${validFiles.length}`);
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const parseResumeData = (fileName: string, fileSize: number) => {
    // Mock parsing - in production, use a document parsing library
    const skills = ["React", "TypeScript", "Node.js", "Python", "SQL"];
    const domains = ["Software Engineering", "Web Development", "Backend"];
    const locations = ["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Pune"];
    
    return {
      name: fileName.replace(/\.(pdf|docx)$/i, "").replace(/[-_]/g, " "),
      email: `${fileName.split(".")[0].toLowerCase()}@example.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      skills: skills.slice(0, Math.floor(Math.random() * 3) + 3),
      experience_years: Math.floor(Math.random() * 10) + 1,
      expected_ctc: Math.floor(Math.random() * 20) + 5,
      current_ctc: Math.floor(Math.random() * 15) + 3,
      location: locations[Math.floor(Math.random() * locations.length)],
      domain: domains[Math.floor(Math.random() * domains.length)],
      education: "Bachelor's Degree in Computer Science",
      ats_score: Math.floor(Math.random() * 40) + 60,
      status: "new" as const,
    };
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to upload resumes");
        return;
      }

      const totalFiles = files.length;
      let processedFiles = 0;

      for (const file of files) {
        const candidateData = parseResumeData(file.name, file.size);
        
        const { error } = await supabase.from("candidates").insert(candidateData);

        if (error) {
          console.error("Error inserting candidate:", error);
          toast.error(`Failed to process ${file.name}`);
        } else {
          // Create notification
          await supabase.from("notifications").insert({
            user_id: user.id,
            type: "candidate",
            title: "New Candidate Added",
            message: `${candidateData.name} has been added to the candidate pool with ATS score of ${candidateData.ats_score}%`,
          });

          // Send email notification
          const { data: profile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", user.id)
            .single();

          if (profile?.email) {
            await supabase.functions.invoke("send-notification-email", {
              body: {
                to: profile.email,
                type: "candidate",
                title: "New Candidate Added",
                message: `${candidateData.name} has been successfully added to your candidate pool with an ATS score of ${candidateData.ats_score}%.`,
                candidateName: candidateData.name,
              },
            });
          }
        }

        processedFiles++;
        setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
      }

      onUpload(files);
      setFiles([]);
      setUploadProgress(0);
      toast.success(`Successfully uploaded and parsed ${totalFiles} resume(s)!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload resumes");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop the files here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">
              Drag & drop resumes here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF and DOCX files (max 10MB each, up to 50 files)
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">{files.length} file(s) selected:</p>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-center mt-2 text-muted-foreground">
            Uploading and parsing resumes... {uploadProgress}%
          </p>
        </div>
      )}

      {files.length > 0 && !isUploading && (
        <Button
          onClick={handleUpload}
          className="w-full mt-4"
          disabled={isUploading}
        >
          Upload & Parse {files.length} Resume(s)
        </Button>
      )}
    </Card>
  );
}
