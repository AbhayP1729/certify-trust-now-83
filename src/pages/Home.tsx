
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import OrganizationsCarousel from '@/components/home/OrganizationsCarousel';
import HowItWorks from '@/components/home/HowItWorks';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <StatsSection />
        <OrganizationsCarousel />
        <HowItWorks />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
