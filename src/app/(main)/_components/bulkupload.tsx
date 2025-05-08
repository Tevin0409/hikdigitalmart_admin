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
import {
  Upload,
  Download,
  AlertCircle,
  Loader2,
  CloudUploadIcon,
  X,
} from "lucide-react";
import { bulkUploadProducts } from "../actions";
import { cn } from "@/lib/utils";

export default function UploadProductsDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      setError("Please upload a valid Excel file (.xlsx)");
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
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
        setError(response.message);
      }
    } catch (err) {
      console.log("errr", err);
      //   setError(err.message);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CloudUploadIcon />
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
            "border-2 border-dashed px-6 py-24 items-center justify-center flex text-center rounded-lg cursor-pointer",
            error && "border-red-500",
            !error && " border-gray-300"
          )}
        >
          {!file && (
            <div>
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 text-gray-500" size={32} />
              <p className="text-sm text-gray-500">
                Drag and drop file here or{" "}
                <span className="text-gray-900 text-sm cursor-pointer underline">
                  Click to upload
                </span>
              </p>
            </div>
          )}
          {file && (
            <div className="flex items-center gap-2">
              <input {...getInputProps()} />
              <p
                className={cn(
                  "text-sm text-green-600",
                  error && "text-red-500"
                )}
              >
                {file.name}
              </p>
              <span className="text-gray-800 text-sm cursor-pointer underline">
                Change
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supported format: .xlsx | Maximum size: 5MB
        </p>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <div className="flex justify-between">
                <span>{error}</span>
                <span
                  className="text-xs cursor-pointer"
                  onClick={() => setError(null)}
                >
                  <X className="h-4 w-4" />
                </span>
              </div>
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4 flex items-center gap-2 bg-gray-100 p-3 rounded-lg">
          <div className="flex-1">
            <span className="flex justify-start gap-3">
              <Image src="/xls.png" alt="sample" width={20} height={20} />
              <p className="text-sm font-semibold">Sample Format</p>
            </span>
            <p className="text-xs text-gray-500 my-3">
              You can download the attached sample file and use them as a
              starting point for your own file.
            </p>
          </div>
          <Button variant="ghost" onClick={handleDownloadSample}>
            <Download className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Import File"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
