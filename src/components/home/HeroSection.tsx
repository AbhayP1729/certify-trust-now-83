
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/5 pt-16">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-primary/5 -top-10 -left-10 animate-float" />
        <div className="absolute w-96 h-96 rounded-full bg-accent/5 bottom-0 -right-20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute w-48 h-48 rounded-full bg-secondary/5 top-1/3 left-1/4 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 animate-slide-in">
              <span className="block">Blockchain-Powered</span>
              <span className="block text-primary">Credential Verification</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl animate-slide-in" style={{ animationDelay: '0.2s' }}>
              Secure, tamper-proof academic credential verification system ensuring the authenticity of certificates globally through blockchain technology.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/verify">
                <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-primary/40">
                  Verify Certificate
                </Button>
              </Link>
              <Link to="/agency/login">
                <Button size="lg" variant="outline" className="border-2">
                  Agency Login
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center relative animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-white rounded-xl shadow-2xl transform -rotate-6 opacity-30"></div>
              <div className="absolute inset-0 bg-white rounded-xl shadow-2xl transform rotate-3 opacity-60"></div>
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-primary p-4 text-white font-medium text-center">
                  Verified Academic Credential
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <img src="/src/assets/verified.svg" alt="Verified" className="h-12 w-12 animate-pulse-slow" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Name:</span>
                      <span className="font-medium">John Smith</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Degree:</span>
                      <span className="font-medium">Bachelor of Science</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Institution:</span>
                      <span className="font-medium">Harvard University</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Date:</span>
                      <span className="font-medium">May 15, 2023</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-xs text-gray-500">Blockchain ID:</span>
                      <span className="text-xs font-mono bg-gray-100 p-1 rounded">0x1a2b...3c4d</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default HeroSection;
