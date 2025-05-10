
import { useState, useRef } from 'react';
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
import { FileArchive, Download, Archive, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AgencyNavbar from '@/components/agency/AgencyNavbar';

const CertificatesPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [qrZipFile, setQrZipFile] = useState<File | null>(null);
  const [certZipFile, setCertZipFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const qrZipInputRef = useRef<HTMLInputElement>(null);
  const certZipInputRef = useRef<HTMLInputElement>(null);

  // Mocked certificate and QR code files
  const mockFiles = {
    qrFiles: [
      { name: 'QR_CERT001.png', size: 12345 },
      { name: 'QR_CERT002.png', size: 10234 },
      { name: 'QR_CERT003.png', size: 11567 }
    ],
    certFiles: [
      { name: 'CERT001.pdf', size: 145678 },
      { name: 'CERT002.pdf', size: 134567 },
      { name: 'CERT003.pdf', size: 156789 }
    ],
    mergedFiles: [] as { name: string, merged: boolean }[]
  };

  const [filesList, setFilesList] = useState(mockFiles);

  const handleQrZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setQrZipFile(file);
    } else if (file) {
      toast({
        title: "Invalid file type",
        description: "Please upload a zip file containing QR codes",
        variant: "destructive",
      });
    }
  };

  const handleCertZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setCertZipFile(file);
    } else if (file) {
      toast({
        title: "Invalid file type",
        description: "Please upload a zip file containing certificates",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
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

    // Simulate file upload and processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    // Simulate processing time
    setTimeout(() => {
      clearInterval(interval);
      setUploading(false);
      setProgress(100);

      // Create matched files for merging
      const mergedFiles = filesList.qrFiles.map(qrFile => {
        // Extract certificate ID from QR filename (assuming format QR_CERTXXX.png)
        const certId = qrFile.name.substring(3, qrFile.name.lastIndexOf('.'));
        return {
          name: certId,
          merged: false
        };
      });
      
      setFilesList({
        ...filesList,
        mergedFiles
      });
      
      setActiveTab('attach');
      
      toast({
        title: "Files uploaded",
        description: "QR codes and certificates are ready to be attached",
      });
    }, 3000);
  };

  const handleMerge = () => {
    setMerging(true);
    
    // Simulate merging process
    let count = 0;
    const interval = setInterval(() => {
      setFilesList(prev => {
        if (count >= prev.mergedFiles.length) {
          clearInterval(interval);
          return prev;
        }
        
        const updated = {...prev};
        updated.mergedFiles[count].merged = true;
        count++;
        return updated;
      });
    }, 800);
    
    // Complete the process after all files are "merged"
    setTimeout(() => {
      clearInterval(interval);
      setMerging(false);
      
      toast({
        title: "Merging complete",
        description: "All certificates have been merged with QR codes",
      });
    }, filesList.mergedFiles.length * 800 + 200);
  };

  const handleDownloadAll = () => {
    toast({
      title: "Download Started",
      description: "The merged certificates are being prepared for download as a ZIP file.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Merged certificates have been downloaded successfully.",
      });
    }, 2000);
  };

  const resetFiles = () => {
    setQrZipFile(null);
    setCertZipFile(null);
    if (qrZipInputRef.current) qrZipInputRef.current.value = '';
    if (certZipInputRef.current) certZipInputRef.current.value = '';
  };

  return (
    <div>
      <AgencyNavbar />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Certificate Management</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="attach">Attach QR Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Upload Certificate and QR Code Files</CardTitle>
                <CardDescription>
                  Upload zip files containing certificates and QR codes to merge them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="qrZip">Upload QR Codes (ZIP file)</Label>
                    <Input
                      id="qrZip"
                      type="file"
                      ref={qrZipInputRef}
                      onChange={handleQrZipChange}
                      accept=".zip"
                      className="flex-1"
                    />
                    {qrZipFile && (
                      <p className="text-sm text-muted-foreground">
                        {qrZipFile.name} ({(qrZipFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certZip">Upload Certificates (ZIP file)</Label>
                    <Input
                      id="certZip"
                      type="file"
                      ref={certZipInputRef}
                      onChange={handleCertZipChange}
                      accept=".zip"
                      className="flex-1"
                    />
                    {certZipFile && (
                      <p className="text-sm text-muted-foreground">
                        {certZipFile.name} ({(certZipFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                  
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Processing ZIP files</Label>
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
                    QR codes and certificates with matching names will be merged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>QR Code Files</Label>
                      <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                        <ul className="space-y-1">
                          {filesList.qrFiles.map((file, index) => (
                            <li key={`qr-${index}`} className="text-sm flex justify-between">
                              <span>{file.name}</span>
                              <span className="text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Certificate Files</Label>
                      <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                        <ul className="space-y-1">
                          {filesList.certFiles.map((file, index) => (
                            <li key={`cert-${index}`} className="text-sm flex justify-between">
                              <span>{file.name}</span>
                              <span className="text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleMerge}
                    disabled={merging || filesList.mergedFiles.length === 0}
                    className="w-full"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    {merging ? "Merging..." : "Merge Files"}
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
                    <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
                      <ul className="space-y-2">
                        {filesList.mergedFiles.map((file, index) => (
                          <li key={`merge-${index}`} className="text-sm flex items-center justify-between">
                            <span>Certificate {file.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              file.merged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {file.merged ? 'Merged' : 'Pending'}
                            </span>
                          </li>
                        ))}
                        
                        {filesList.mergedFiles.length === 0 && (
                          <li className="text-center text-muted-foreground py-4">
                            No files processed yet. Upload and process files first.
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {filesList.mergedFiles.length > 0 && filesList.mergedFiles.every(f => f.merged) && (
                      <div className="text-center p-2 bg-green-50 rounded-md border border-green-200">
                        <p className="text-green-800 flex items-center justify-center">
                          <Check className="h-4 w-4 mr-1" />
                          All certificates successfully merged with QR codes
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CertificatesPage;
