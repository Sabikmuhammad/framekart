"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

export default function AdminUploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUploadedUrl(data.data.secure_url);
        toast({
          title: "Upload Successful",
          description: "Image uploaded to Cloudinary.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Upload Images</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Cloudinary Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          <Button onClick={handleUpload} disabled={uploading || !file} className="w-full sm:w-auto">
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload to Cloudinary"}
          </Button>

          {uploadedUrl && (
            <div className="rounded-lg border p-3 sm:p-4">
              <p className="mb-2 text-xs sm:text-sm font-semibold">Uploaded Image URL:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input value={uploadedUrl} readOnly className="text-xs sm:text-sm" />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    toast({ title: "Copied!", description: "URL copied to clipboard." });
                  }}
                  className="w-full sm:w-auto"
                >
                  Copy
                </Button>
              </div>
              <img
                src={uploadedUrl}
                alt="Uploaded"
                className="mt-3 sm:mt-4 max-h-48 sm:max-h-64 rounded object-contain w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
