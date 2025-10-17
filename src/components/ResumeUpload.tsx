import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

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

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      onUpload(files);
      setFiles([]);
      setUploadProgress(0);
      toast.success(`Successfully uploaded ${files.length} resume(s)`);
    } catch (error) {
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
              Supports PDF and DOCX files (max 10MB each)
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
