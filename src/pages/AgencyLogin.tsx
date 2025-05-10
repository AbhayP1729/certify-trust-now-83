
import AgencyLoginForm from '@/components/agency/AgencyLoginForm';
import { Link } from 'react-router-dom';

const AgencyLogin = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center">
            <img src="/src/assets/blockchain.svg" alt="Logo" className="h-12 w-12" />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Agency Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Securely manage certificates and organizations
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AgencyLoginForm />
        </div>
      </div>
    </div>
  );
};

export default AgencyLogin;
