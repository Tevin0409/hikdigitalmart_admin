"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Upload, Download, X, CloudUploadIcon, Loader2 } from "lucide-react";
import { bulkUploadProducts } from "../actions";
import { cn } from "@/lib/utils";

export default function UploadProductsDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setFile(null);
    setError(null);
    setLoading(false);
  };

  const closeModal = () => {
    resetState();
    setOpen(false);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Invalid file format. Please upload a .xlsx Excel file.");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: () => {
      setError(
        "File too large or unsupported format. Maximum allowed size is 5MB."
      );
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await bulkUploadProducts(formData);
      if (!response.success) {
        setError(response.message || "Upload failed. Please try again later.");
        return;
      }

      // Optionally: toast.success("Products imported successfully");
      closeModal();
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href =
      "https://ujputcylhp.ufs.sh/f/jvPVlPOjcwEvNoZcVprsVy4padmcboelWwQuNOD7tUhHq9g2";
    link.download = "sample-format.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CloudUploadIcon className="mr-2 h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed px-6 py-24 flex items-center justify-center text-center rounded-lg cursor-pointer",
            error ? "border-red-500" : "border-gray-300"
          )}
        >
          <input {...getInputProps()} />
          {!file ? (
            <div>
              <Upload className="mx-auto mb-2 text-gray-500" size={32} />
              <p className="text-sm text-gray-500">
                Drag and drop file here or{" "}
                <span className="text-gray-900 text-sm underline">
                  Click to upload
                </span>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "text-sm",
                  error ? "text-red-500" : "text-green-600"
                )}
              >
                {file.name}
              </p>
              <span className="text-gray-800 text-sm underline">Change</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Supported format: .xlsx | Maximum size: 5MB
        </p>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <X
                className="h-4 w-4 cursor-pointer"
                onClick={() => setError(null)}
              />
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4 flex items-center gap-2  p-3 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Image src="/xls.png" alt="sample" width={20} height={20} />
              <p className="text-sm font-semibold">Sample Format</p>
            </div>
            <p className="text-xs text-gray-500 my-3">
              Download this sample Excel file and use it as a reference for your
              product data.
            </p>
          </div>
          <Button variant="ghost" onClick={handleDownloadSample}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" disabled={loading} onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Import File"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
