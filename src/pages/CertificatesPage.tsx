
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
import { FileUploader } from '@/components/agency/FileUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, QrCode, Eye, Download, Check } from 'lucide-react';

// Mock certificates data
const mockCertificates = [
  { id: 1, name: 'Certificate #12345', organization: 'University of Technology', status: 'Processed', date: '2025-04-28', hasQr: true },
  { id: 2, name: 'Certificate #12346', organization: 'University of Technology', status: 'Processed', date: '2025-04-28', hasQr: true },
  { id: 3, name: 'Certificate #12347', organization: 'Global Institute', status: 'Pending QR', date: '2025-04-27', hasQr: false },
  { id: 4, name: 'Certificate #12348', organization: 'EduCert Academy', status: 'Pending QR', date: '2025-04-26', hasQr: false },
];

// Mock QR codes data
const mockQrCodes = [
  { id: 1, name: 'QR #12345', organization: 'University of Technology', date: '2025-04-28' },
  { id: 2, name: 'QR #12346', organization: 'University of Technology', date: '2025-04-28' },
  { id: 3, name: 'QR #12347', organization: 'Global Institute', date: '2025-04-27' },
];

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState(mockCertificates);
  const [selectedCertificates, setSelectedCertificates] = useState<number[]>([]);
  const [selectedQrCodes, setSelectedQrCodes] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCertificateUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    if (!selectedOrganization) {
      toast({
        title: "Error",
        description: "Please select an organization first",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      
      // Create new certificate entries
      const newCertificates = Array.from(files).map((file, index) => ({
        id: certificates.length + index + 1,
        name: file.name.substring(0, file.name.lastIndexOf('.')),
        organization: selectedOrganization,
        status: 'Pending QR',
        date: new Date().toISOString().split('T')[0],
        hasQr: false
      }));
      
      setCertificates([...newCertificates, ...certificates]);
      
      toast({
        title: "Upload Complete",
        description: `${files.length} certificates uploaded successfully.`,
      });
    }, 2000);
  };
  
  const handleCertificateSelection = (id: number) => {
    setSelectedCertificates(prev => 
      prev.includes(id) 
        ? prev.filter(certId => certId !== id) 
        : [...prev, id]
    );
  };
  
  const handleQrCodeSelection = (id: number) => {
    setSelectedQrCodes(prev => 
      prev.includes(id) 
        ? prev.filter(qrId => qrId !== id) 
        : [...prev, id]
    );
  };
  
  const handleAttachQRs = () => {
    if (selectedCertificates.length === 0 || selectedQrCodes.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select both certificates and QR codes to attach.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedCertificates.length !== selectedQrCodes.length) {
      toast({
        title: "Mismatch",
        description: "The number of selected certificates and QR codes must match.",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      // Update certificates to mark as having QR codes
      const updatedCertificates = certificates.map(cert => {
        if (selectedCertificates.includes(cert.id)) {
          return { ...cert, hasQr: true, status: 'Processed' };
        }
        return cert;
      });
      
      setCertificates(updatedCertificates);
      setSelectedCertificates([]);
      setSelectedQrCodes([]);
      setProcessing(false);
      
      toast({
        title: "Success",
        description: "QR codes have been attached to certificates successfully.",
      });
    }, 3000);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Certificate Management</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload">Upload Certificates</TabsTrigger>
          <TabsTrigger value="manage">Manage Certificates</TabsTrigger>
          <TabsTrigger value="attach">Attach QR Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Upload Certificates</CardTitle>
              <CardDescription>
                Upload PDF certificates from organizations to process them
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
                
                <FileUploader
                  onFilesSelected={handleCertificateUpload}
                  acceptedFileTypes=".pdf"
                  maxFiles={10}
                  maxSize={5}
                  isUploading={uploading}
                  label="Drag & drop PDF files here, or click to browse"
                  description="Upload up to 10 PDF certificates (max 5 MB each)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Inventory</CardTitle>
              <CardDescription>
                View and manage all uploaded certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Input 
                    placeholder="Search certificates..." 
                    className="max-w-sm"
                  />
                  <Button variant="outline">Search</Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{cert.name}</CardTitle>
                        <CardDescription>{cert.organization}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Date: {cert.date}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            cert.status === 'Processed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cert.status}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attach">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Certificates</CardTitle>
                <CardDescription>
                  Choose certificates to attach QR codes to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                          <th className="text-left p-2">Select</th>
                          <th className="text-left p-2">Certificate</th>
                          <th className="text-left p-2">Organization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.filter(c => !c.hasQr).map((cert) => (
                          <tr key={cert.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <input 
                                type="checkbox" 
                                checked={selectedCertificates.includes(cert.id)}
                                onChange={() => handleCertificateSelection(cert.id)} 
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="p-2">{cert.name}</td>
                            <td className="p-2">{cert.organization}</td>
                          </tr>
                        ))}
                        {certificates.filter(c => !c.hasQr).length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                              No certificates need QR codes
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Select QR Codes</CardTitle>
                <CardDescription>
                  Choose QR codes to attach to certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                          <th className="text-left p-2">Select</th>
                          <th className="text-left p-2">QR Code</th>
                          <th className="text-left p-2">Organization</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockQrCodes.map((qr) => (
                          <tr key={qr.id} className="border-b hover:bg-muted/50">
                            <td className="p-2">
                              <input 
                                type="checkbox"
                                checked={selectedQrCodes.includes(qr.id)}
                                onChange={() => handleQrCodeSelection(qr.id)}
                                className="h-4 w-4"
                              />
                            </td>
                            <td className="p-2">{qr.name}</td>
                            <td className="p-2">{qr.organization}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      disabled={selectedCertificates.length === 0 || selectedQrCodes.length === 0 || processing}
                      onClick={handleAttachQRs}
                    >
                      {processing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Attach QR Codes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificatesPage;
