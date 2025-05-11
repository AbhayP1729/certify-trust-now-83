
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileArchive, Download, Merge, QrCode, Image } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AgencyNavbar from '@/components/agency/AgencyNavbar';
import { FileUploader } from '@/components/agency/FileUploader';
import { 
  extractZipFiles, 
  extractFileId, 
  mergeQrCodeOnCertificate, 
  createMergedZip 
} from '@/utils/imageProcessor';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface MergedFile {
  name: string;
  id: number;
  merged: boolean;
  blob?: Blob;
  previewUrl?: string;
}

interface ProcessedFile {
  name: string;
  id: number;
  size: number;
  blob: Blob;
}

const CertificatesPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [qrZipFile, setQrZipFile] = useState<File | null>(null);
  const [certZipFile, setCertZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [selectedPreviewName, setSelectedPreviewName] = useState('');
  
  const [filesList, setFilesList] = useState<{
    qrFiles: ProcessedFile[];
    certFiles: ProcessedFile[];
    mergedFiles: MergedFile[];
  }>({
    qrFiles: [],
    certFiles: [],
    mergedFiles: []
  });

  const handleQrZipSelected = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.zip')) {
        setQrZipFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a zip file containing QR code images",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleCertZipSelected = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.zip')) {
        setCertZipFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a zip file containing certificate images",
          variant: "destructive",
        });
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!qrZipFile || !certZipFile) {
      toast({
        title: "Missing files",
        description: "Please upload both QR code and certificate zip files",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setProgressMessage('Extracting QR code files...');

    try {
      // Extract QR codes
      setProgress(10);
      console.log("Extracting QR codes from:", qrZipFile.name);
      const qrExtractedFiles = await extractZipFiles(qrZipFile);
      console.log("QR extracted files:", qrExtractedFiles.length);
      
      const qrFiles = qrExtractedFiles.map(file => {
        const id = extractFileId(file.filename);
        console.log(`Processing QR file: ${file.filename}, ID: ${id}`);
        return {
          name: file.filename,
          id: id,
          size: file.blob.size,
          blob: file.blob
        };
      }).filter(file => file.id !== -1);
      
      console.log("Processed QR files:", qrFiles.length);
      setProgress(40);
      setProgressMessage('Extracting certificate files...');
      
      // Extract certificates
      console.log("Extracting certificates from:", certZipFile.name);
      const certExtractedFiles = await extractZipFiles(certZipFile);
      console.log("Certificate extracted files:", certExtractedFiles.length);
      
      const certFiles = certExtractedFiles.map(file => {
        const id = extractFileId(file.filename);
        console.log(`Processing certificate file: ${file.filename}, ID: ${id}`);
        return {
          name: file.filename,
          id: id,
          size: file.blob.size,
          blob: file.blob
        };
      }).filter(file => file.id !== -1);
      
      console.log("Processed certificate files:", certFiles.length);
      setProgress(70);
      setProgressMessage('Processing files...');
      
      // Sort files by ID to ensure correct matching
      qrFiles.sort((a, b) => a.id - b.id);
      certFiles.sort((a, b) => a.id - b.id);
      
      // Create merged files structure
      const mergedFiles = certFiles.map(cert => ({
        name: `MERGED_${cert.id.toString().padStart(2, '0')}`,
        id: cert.id,
        merged: false
      }));
      
      setProgress(100);
      setFilesList({
        qrFiles,
        certFiles,
        mergedFiles
      });
      
      setActiveTab('attach');
      setUploading(false);
      
      toast({
        title: "Files uploaded",
        description: `${qrFiles.length} QR codes and ${certFiles.length} certificates are ready to be merged`,
      });
    } catch (error) {
      console.error('Error processing zip files:', error);
      setUploading(false);
      toast({
        title: "Error processing files",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleMerge = async () => {
    if (filesList.qrFiles.length === 0 || filesList.certFiles.length === 0) {
      toast({
        title: "No files to merge",
        description: "Please upload and process files first",
        variant: "destructive",
      });
      return;
    }

    setMerging(true);
    setProgress(0);
    
    try {
      // Create mapping of QR codes by ID for quick lookup
      const qrFilesMap = new Map(filesList.qrFiles.map(file => [file.id, file]));
      
      // Process files in sequence with progress updates
      const totalFiles = filesList.certFiles.length;
      const mergedResults: MergedFile[] = [];
      
      for (let i = 0; i < filesList.certFiles.length; i++) {
        const cert = filesList.certFiles[i];
        const qr = qrFilesMap.get(cert.id);
        
        if (qr) {
          setProgressMessage(`Merging certificate ${i + 1} of ${totalFiles}...`);
          setProgress(Math.round(((i + 1) / totalFiles) * 100));
          
          try {
            // Merge QR code onto certificate
            const mergedBlob = await mergeQrCodeOnCertificate(
              cert.blob,
              qr.blob,
              15, // QR code size (15% of certificate width)
              'left', // Changed from 'right' to 'left'
              'top', // Position Y
              2 // Margin (2% of certificate width)
            );
            
            // Create a preview URL
            const previewUrl = URL.createObjectURL(mergedBlob);
            
            mergedResults.push({
              name: `MERGED_${cert.id.toString().padStart(2, '0')}`,
              id: cert.id,
              merged: true,
              blob: mergedBlob,
              previewUrl
            });
          } catch (error) {
            console.error(`Error merging certificate ${cert.id}:`, error);
            mergedResults.push({
              name: `MERGED_${cert.id.toString().padStart(2, '0')}`,
              id: cert.id,
              merged: false
            });
          }
        } else {
          // No matching QR code found
          mergedResults.push({
            name: `MERGED_${cert.id.toString().padStart(2, '0')}`,
            id: cert.id,
            merged: false
          });
        }
      }
      
      setFilesList(prev => ({
        ...prev,
        mergedFiles: mergedResults
      }));
      
      toast({
        title: "Merging complete",
        description: `${mergedResults.filter(f => f.merged).length} of ${totalFiles} certificates have been merged with QR codes`,
      });
    } catch (error) {
      console.error('Error merging files:', error);
      toast({
        title: "Error merging files",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setMerging(false);
      setProgress(100);
    }
  };

  const handleDownloadAll = async () => {
    const mergedFiles = filesList.mergedFiles.filter(file => file.merged && file.blob);
    
    if (mergedFiles.length === 0) {
      toast({
        title: "No merged files",
        description: "There are no successfully merged files to download",
        variant: "destructive",
      });
      return;
    }
    
    setProgressMessage('Creating download package...');
    setProgress(0);
    
    try {
      // Create a zip file with all merged certificates
      const filesToZip = mergedFiles.map(file => ({
        name: file.name,
        blob: file.blob as Blob
      }));
      
      setProgress(50);
      const zipBlob = await createMergedZip(filesToZip);
      setProgress(100);
      
      // Create download link
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'merged_certificates.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${mergedFiles.length} merged certificates are being downloaded as a ZIP file.`,
      });
    } catch (error) {
      console.error('Error creating download:', error);
      toast({
        title: "Error creating download",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePreviewClick = (previewUrl: string | undefined, fileName: string) => {
    if (previewUrl) {
      setSelectedPreview(previewUrl);
      setSelectedPreviewName(fileName);
      setPreviewDialogOpen(true);
    } else {
      toast({
        title: "Preview not available",
        description: "This certificate hasn't been successfully merged yet",
        variant: "destructive",
      });
    }
  };

  const resetFiles = () => {
    setQrZipFile(null);
    setCertZipFile(null);
    setFilesList({
      qrFiles: [],
      certFiles: [],
      mergedFiles: []
    });
    
    // Clean up any object URLs to prevent memory leaks
    filesList.mergedFiles.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
  };

  return (
    <div>
      <AgencyNavbar />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Certificate Management</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="attach">Merge QR Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Upload Certificate and QR Code Files</CardTitle>
                <CardDescription>
                  Upload zip files containing certificates (CE_01.jpg, CE_02.jpg) and QR codes (QR_01.jpg, QR_02.jpg)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Upload QR Codes (ZIP file)</Label>
                    <FileUploader
                      onFilesSelected={handleQrZipSelected}
                      acceptedFileTypes=".zip"
                      maxFiles={1}
                      maxSize={50} // 50MB
                      isUploading={uploading}
                      label="Upload QR code ZIP file"
                      description="ZIP file containing QR_01.jpg, QR_02.jpg etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Certificates (ZIP file)</Label>
                    <FileUploader
                      onFilesSelected={handleCertZipSelected}
                      acceptedFileTypes=".zip"
                      maxFiles={1}
                      maxSize={100} // 100MB
                      isUploading={uploading}
                      label="Upload certificates ZIP file"
                      description="ZIP file containing CE_01.jpg, CE_02.jpg etc."
                    />
                  </div>
                  
                  {(uploading || merging) && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>{progressMessage}</Label>
                        <span className="text-sm">{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleUpload}
                      disabled={!qrZipFile || !certZipFile || uploading}
                      className="flex-1"
                    >
                      <FileArchive className="mr-2 h-4 w-4" />
                      Process Files
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetFiles}
                      disabled={uploading}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attach">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Files Ready for Merging</CardTitle>
                  <CardDescription>
                    QR codes will be placed at the top right corner of matching certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <QrCode className="h-4 w-4 mr-2" />
                        <Label>QR Code Files</Label>
                      </div>
                      <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                        {filesList.qrFiles.length > 0 ? (
                          <ul className="space-y-1">
                            {filesList.qrFiles.map((file, index) => (
                              <li key={`qr-${index}`} className="text-sm flex justify-between">
                                <span>{file.name}</span>
                                <span className="text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            No QR code files processed yet
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Image className="h-4 w-4 mr-2" />
                        <Label>Certificate Files</Label>
                      </div>
                      <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                        {filesList.certFiles.length > 0 ? (
                          <ul className="space-y-1">
                            {filesList.certFiles.map((file, index) => (
                              <li key={`cert-${index}`} className="text-sm flex justify-between">
                                <span>{file.name}</span>
                                <span className="text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            No certificate files processed yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleMerge}
                    disabled={merging || filesList.certFiles.length === 0 || filesList.qrFiles.length === 0}
                    className="w-full"
                  >
                    <Merge className="mr-2 h-4 w-4" />
                    {merging ? "Merging..." : "Merge QR Codes onto Certificates"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Merge Status</CardTitle>
                  <CardDescription>
                    Status of QR code and certificate merging process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(merging) && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>{progressMessage}</Label>
                          <span className="text-sm">{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )}
                    
                    <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
                      <ul className="space-y-2">
                        {filesList.mergedFiles.map((file, index) => (
                          <li 
                            key={`merge-${index}`} 
                            className={`text-sm flex items-center justify-between p-2 rounded-md ${
                              file.previewUrl ? 'cursor-pointer hover:bg-gray-100' : ''
                            }`}
                            onClick={() => handlePreviewClick(file.previewUrl, file.name)}
                          >
                            <span>Certificate {file.id.toString().padStart(2, '0')}</span>
                            <div className="flex items-center">
                              {file.previewUrl && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 mr-2 px-2"
                                >
                                  Preview
                                </Button>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                file.merged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {file.merged ? 'Merged' : 'Pending'}
                              </span>
                            </div>
                          </li>
                        ))}
                        
                        {filesList.mergedFiles.length === 0 && (
                          <li className="text-center text-muted-foreground py-4">
                            No files processed yet. Upload and process files first.
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {filesList.mergedFiles.length > 0 && filesList.mergedFiles.some(f => f.merged) && (
                      <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
                        <p className="text-green-800 flex items-center justify-center">
                          <span className="font-medium">
                            {filesList.mergedFiles.filter(f => f.merged).length} of {filesList.mergedFiles.length} certificates merged
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleDownloadAll}
                    disabled={!filesList.mergedFiles.some(f => f.merged)}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Merged ZIP
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Preview: {selectedPreviewName}</DialogTitle>
                  <DialogDescription>
                    Certificate with QR code in the top-right corner
                  </DialogDescription>
                </DialogHeader>
                
                <div className="overflow-hidden rounded-md border">
                  {selectedPreview && (
                    <img 
                      src={selectedPreview} 
                      alt="Certificate with QR code" 
                      className="w-full h-auto"
                    />
                  )}
                </div>
                
                <DialogFooter>
                  <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CertificatesPage;
