"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadProductImages } from "../actions";

interface UploadImagesDialogProps {
  isOpened: boolean;
  modelID: string;
  onClose: () => void;
}

export default function UploadImagesDialog({
  isOpened,
  modelID,
  onClose,
}: UploadImagesDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    multiple: true,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    if (files.length === 1) {
      formData.append(modelID, files[0]);
    } else {
      files.forEach((file) => formData.append(modelID, file));
    }

    try {
      // Replace with your API call
      const response = await uploadProductImages(formData);
      if (!response.success) {
        setError(response.message);
      }

      // TODO: On success, show a success message and close the dialog
      toast.success("Images uploaded successfully");
      setFiles([]);
      onClose();
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpened} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[725px] p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed px-6 py-16 flex flex-col items-center text-center rounded-lg cursor-pointer",
            error ? "border-red-500" : "border-gray-300"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-2 text-gray-500" size={32} />
          <p className="text-sm text-gray-500">
            Drag and drop images here or{" "}
            <span className="text-gray-900 cursor-pointer underline">
              Click to upload
            </span>
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: .jpg, .jpeg, .png, .gif, .webp
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <div className="flex justify-between">
                <span>{error}</span>
                <span className="cursor-pointer" onClick={() => setError(null)}>
                  <X className="h-4 w-4" />
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group h-16 w-16">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  width={64}
                  height={64}
                  className="rounded-md object-cover h-full w-full border border-gray-200"
                />
                <button
                  className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200 opacity-80 hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Upload Images"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
