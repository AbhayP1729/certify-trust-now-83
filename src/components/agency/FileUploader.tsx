
import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  onFilesSelected: (files: FileList | null) => void;
  acceptedFileTypes: string;
  maxFiles: number;
  maxSize: number; // in MB
  isUploading?: boolean;
  label?: string;
  description?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  acceptedFileTypes,
  maxFiles,
  maxSize,
  isUploading = false,
  label = 'Drag & drop files here, or click to browse',
  description = 'Upload files (max 5MB each)'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: FileList | null): boolean => {
    if (!files) return false;
    
    // Check file count
    if (files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return false;
    }

    // Check file types and sizes
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file extension
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFileTypes.includes('*') && !acceptedFileTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `File "${file.name}" is not of an accepted type. Accepted: ${acceptedFileTypes}`,
          variant: "destructive",
        });
        return false;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File "${file.name}" exceeds the maximum size of ${maxSize}MB`,
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    
    if (validateFiles(files)) {
      setSelectedFiles(Array.from(files));
      onFilesSelected(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (validateFiles(files)) {
      setSelectedFiles(files ? Array.from(files) : []);
      onFilesSelected(files);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    // Convert FileList to DataTransfer to pass to onFilesSelected
    if (newFiles.length === 0) {
      onFilesSelected(null);
    } else {
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      onFilesSelected(dataTransfer.files);
    }
  };

  React.useEffect(() => {
    if (isUploading) {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      
      return () => {
        clearInterval(interval);
      };
    } else {
      setUploadProgress(0);
    }
  }, [isUploading]);

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
          transition-colors cursor-pointer`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleFileDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedFileTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-base font-medium">{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Selected Files ({selectedFiles.length})</p>
          
          {isUploading && (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                {!isUploading && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
