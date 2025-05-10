
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/lib/mockData";
import { Download, Printer, AlertTriangle, CheckCircle } from "lucide-react";

interface CertificateResultProps {
  certificate: Certificate;
}

export const CertificateResult = ({ certificate }: CertificateResultProps) => {
  const handlePrint = () => {
    window.print();
  };
  
  if (!certificate.isValid) {
    return (
      <div className="border border-red-300 rounded-lg p-6 bg-red-50 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-red-700 mb-2">Invalid Certificate</h2>
        <p className="text-red-600 mb-4">{certificate.error || "This certificate could not be verified."}</p>
        <div className="bg-white p-4 rounded border border-red-200 inline-block font-mono text-sm mb-4">
          ID: {certificate.id}
        </div>
        <p className="text-gray-600 text-sm">
          If you believe this is an error, please contact the issuing institution or report this certificate for investigation.
        </p>
        <Button variant="destructive" className="mt-4">
          Report Suspicious Certificate
        </Button>
      </div>
    );
  }
  
  return (
    <div className="border border-green-200 rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="bg-green-50 p-4 flex items-center justify-between border-b border-green-100">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-lg font-semibold text-green-800">Verified Certificate</h2>
        </div>
        <Badge className="bg-green-600">Blockchain Verified</Badge>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{certificate.recipient}</h3>
              <p className="text-gray-600">has successfully completed the requirements for</p>
              <p className="text-xl font-semibold mt-1">{certificate.degree}</p>
              <p className="text-gray-600 mt-1">from</p>
              <p className="text-lg font-medium">{certificate.institution}</p>
              <p className="text-gray-500 mt-1">Graduation Date: {certificate.graduationDate}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium mb-2">Blockchain Verification Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-x-2">
                  <span className="text-gray-500">Blockchain ID:</span>
                  <span className="font-mono">{certificate.blockchainId}</span>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <span className="text-gray-500">Timestamp:</span>
                  <span>{certificate.blockchainTimestamp}</span>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <span className="text-gray-500">Certificate ID:</span>
                  <span className="font-mono">{certificate.id}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-6">
            <img src={certificate.qrCodeUrl} alt="Certificate QR Code" className="w-32 h-32" />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Scan to verify this certificate again
            </p>
            
            <div className="mt-6 flex flex-col space-y-2 w-full">
              <Button className="w-full flex items-center justify-center" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-xs text-gray-500">
        This certificate was verified on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}.
        Verification is valid as of this date and time.
      </div>
    </div>
  );
};
