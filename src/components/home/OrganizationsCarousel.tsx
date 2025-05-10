
import { useEffect, useRef } from "react";
import { partnersData, Partner } from "@/lib/mockData";

const OrganizationsCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clone items for infinite scroll
    const items = container.querySelectorAll('.org-item');
    items.forEach(item => {
      const clone = item.cloneNode(true);
      container.appendChild(clone);
    });
  }, []);
  
  const OrganizationLogo = ({ partner }: { partner: Partner }) => (
    <div className="org-item flex-shrink-0 w-40 mx-4">
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow h-28 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden mb-2">
          <img 
            src={partner.logo} 
            alt={partner.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/64x64/f3f4f6/a1a1aa?text=Logo";
            }}
          />
        </div>
        <p className="text-xs text-center font-medium truncate w-full">{partner.name}</p>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Connected Organizations</h2>
        
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          
          <div className="overflow-hidden">
            <div 
              ref={containerRef}
              className="flex animate-marquee py-4"
            >
              {partnersData.map(partner => (
                <OrganizationLogo key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationsCarousel;
