
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QrCode, Download, FilePlus2, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import AgencyNavbar from '@/components/agency/AgencyNavbar';

// Mock QR codes data
const mockQrCodes = [
  { id: 1, name: 'Certificate #12345', hash: 'f9a8b7c6d5e4f3a2b1c0', organization: 'University of Technology', date: '2025-04-28' },
  { id: 2, name: 'Certificate #12346', hash: 'e8d7c6b5a4f3e2d1c0b9', organization: 'University of Technology', date: '2025-04-28' },
  { id: 3, name: 'Certificate #12347', hash: 'a1b2c3d4e5f6g7h8i9j0', organization: 'Global Institute', date: '2025-04-27' },
];

// Mock function to generate a fake QR code URL
const generateQrCodeUrl = (hash: string) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://certifytrust.com/verify?hash=${hash}`)}`;
};

// Function to process Excel data (mock)
const processExcelFile = (file: File): Promise<{ headers: string[], rows: any[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Excel data processing
      // In a real application, this would use a library like xlsx or papaparse
      const mockHeaders = ['certificateId', 'studentName', 'course', 'issueDate', 'expiryDate'];
      const mockRows = [
        { certificateId: 'CERT001', studentName: 'John Doe', course: 'Computer Science', issueDate: '2025-01-15', expiryDate: '2030-01-15' },
        { certificateId: 'CERT002', studentName: 'Jane Smith', course: 'Data Science', issueDate: '2025-01-20', expiryDate: '2030-01-20' },
        { certificateId: 'CERT003', studentName: 'Mike Johnson', course: 'Cybersecurity', issueDate: '2025-01-25', expiryDate: '2030-01-25' },
      ];
      
      resolve({
        headers: mockHeaders,
        rows: mockRows
      });
    }, 1500);
  });
};

// Mock function to send data to backend and receive hashes
const sendToBackendAndGetHashes = async (headers: string[], rows: any[]): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate random hashes for each row
  return rows.map(() => 
    Array.from({length: 20}, () => Math.floor(Math.random() * 16).toString(16)).join('')
  );
};

const QrCodesPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [qrCodes, setQrCodes] = useState(mockQrCodes);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [processedData, setProcessedData] = useState<{ headers: string[], rows: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an Excel (.xlsx) or CSV (.csv) file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedOrganization) {
      toast({
        title: "Error",
        description: "Please select an organization and upload a file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    try {
      // Process Excel file
      const data = await processExcelFile(file);
      setProcessedData(data);
      
      // Send to backend and get hashes
      const hashes = await sendToBackendAndGetHashes(data.headers, data.rows);
      
      // Create QR codes
      const newQrCodes = data.rows.map((row, index) => ({
        id: qrCodes.length + index + 1,
        name: `Certificate #${row.certificateId || Math.floor(Math.random() * 90000) + 10000}`,
        hash: hashes[index],
        organization: selectedOrganization,
        date: new Date().toISOString().split('T')[0]
      }));

      setQrCodes([...newQrCodes, ...qrCodes]);
      
      toast({
        title: "Success",
        description: `${newQrCodes.length} QR codes have been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(100);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadAll = () => {
    toast({
      title: "Download Started",
      description: "All QR codes are being prepared for download as a ZIP file.",
    });
    
    // In a real app, this would trigger a backend download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "QR codes have been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div>
      <AgencyNavbar />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">QR Code Generation</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New QR Codes</CardTitle>
              <CardDescription>
                Upload an Excel or CSV file with certificate data to generate QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Select Organization</Label>
                  <select
                    id="organization"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1"
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                  >
                    <option value="">Select an organization</option>
                    <option value="University of Technology">University of Technology</option>
                    <option value="Global Institute">Global Institute</option>
                    <option value="EduCert Academy">EduCert Academy</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Excel/CSV File</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="file" 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange} 
                      accept=".xlsx,.csv"
                      className="flex-1" 
                    />
                    {file && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {file && (
                    <p className="text-sm text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                  )}
                </div>
                
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Processing</Label>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
                
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || !selectedOrganization || uploading}
                  className="w-full"
                >
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Generate QR Codes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated QR Codes</CardTitle>
                <CardDescription>List of all QR codes generated</CardDescription>
              </div>
              <Button variant="outline" onClick={handleDownloadAll}>
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>QR Code</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qrCodes.map((qr) => (
                      <TableRow key={qr.id}>
                        <TableCell className="font-medium">{qr.name}</TableCell>
                        <TableCell>{qr.organization}</TableCell>
                        <TableCell>{qr.date}</TableCell>
                        <TableCell>
                          <img 
                            src={generateQrCodeUrl(qr.hash)} 
                            alt={`QR Code for ${qr.name}`} 
                            className="w-10 h-10"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              window.open(generateQrCodeUrl(qr.hash), '_blank');
                              toast({
                                title: "QR Code Opened",
                                description: "QR code opened in a new tab.",
                              });
                            }}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Download Started",
                                description: `QR code for ${qr.name} is being downloaded.`,
                              });
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {processedData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Processed Excel Data</CardTitle>
              <CardDescription>Preview of the data extracted from your Excel file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {processedData.headers.map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedData.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {processedData.headers.map((header, cellIndex) => (
                          <TableCell key={cellIndex}>{row[header]}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QrCodesPage;
