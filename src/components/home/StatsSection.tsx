
import { useEffect, useState } from "react";
import { statsData } from "@/lib/mockData";

const AnimatedCounter = ({ value, label }: { value: number, label: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 20; // 20ms between updates
    const steps = duration / interval;
    const increment = Math.ceil(value / steps);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      setCount(current);
    }, interval);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div className="text-center p-6 bg-white border border-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-3xl sm:text-4xl font-bold text-primary">
        {count.toLocaleString()}+
      </h3>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="bg-gradient-to-b from-secondary/5 to-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Trusted by Educational Institutions Worldwide
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedCounter value={statsData.certificatesIssued} label="Certificates Issued" />
          <AnimatedCounter value={statsData.organizationsOnboarded} label="Organizations Onboarded" />
          <AnimatedCounter value={statsData.verificationsPerformed} label="Verifications Performed" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
