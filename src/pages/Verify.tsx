
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerificationForm from '@/components/verify/VerificationForm';

const Verify = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold">Certificate Verification</h1>
            <p className="mt-2 text-gray-600">
              Verify the authenticity of an academic certificate using our blockchain-powered verification system.
            </p>
          </div>
          
          <VerificationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Verify;
