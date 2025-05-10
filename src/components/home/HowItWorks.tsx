
import { CheckCircle, Upload, Search, Shield } from "lucide-react";

const stepVariants = {
  blue: "bg-primary/10 border-primary/30 text-primary",
  teal: "bg-accent/10 border-accent/30 text-accent",
  purple: "bg-purple-500/10 border-purple-500/30 text-purple-500",
};

const StepItem = ({ 
  icon, 
  title, 
  description, 
  colorVariant, 
  delay 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  colorVariant: keyof typeof stepVariants,
  delay: string
}) => (
  <div 
    className="flex flex-col items-center text-center animate-slide-in opacity-0" 
    style={{ animationDelay: delay }}
  >
    <div className={`p-4 rounded-full border-2 ${stepVariants[colorVariant]} mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform leverages blockchain technology to ensure credentials remain secure, verifiable, and tamper-proof.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepItem
            icon={<Upload size={32} />}
            title="Issue"
            description="Educational institutions securely upload and issue certificates to the blockchain, creating a permanent, immutable record."
            colorVariant="blue"
            delay="0.1s"
          />
          
          <StepItem
            icon={<Search size={32} />}
            title="Verify"
            description="Anyone can instantly verify the authenticity of credentials by scanning a QR code or entering a unique certificate ID."
            colorVariant="teal"
            delay="0.3s"
          />
          
          <StepItem
            icon={<Shield size={32} />}
            title="Trust"
            description="Employers and other third parties can trust the authenticity of credentials, eliminating fraud and credential misrepresentation."
            colorVariant="purple"
            delay="0.5s"
          />
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center text-primary">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Blockchain-secured, tamper-proof credentials</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
