"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className, label = "Upload Image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    setIsUploading(true);
    
    // Mock upload delay
    setTimeout(() => {
      // Create an object URL for preview purposes as a mock
      const mockUrl = URL.createObjectURL(file);
      onChange(mockUrl);
      setIsUploading(false);
    }, 1500);
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-center h-48 w-full group">
          <img src={value} alt="Uploaded" className="max-h-full max-w-full object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100 transition shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 w-full transition-colors cursor-pointer",
            isDragging 
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" 
              : "border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="bg-indigo-50 dark:bg-slate-800 p-3 rounded-full mb-3">
                <UploadCloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Click or drag image to upload
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
