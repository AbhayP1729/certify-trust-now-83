
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Upload, QrCode, BarChart3, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AgencyNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, this would clear auth state
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/agency/dashboard" className="flex items-center">
              <img src="/src/assets/blockchain.svg" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl text-primary">CertifyTrust</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              to="/agency/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/agency/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary'
              } transition-colors`}
            >
              <div className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </Link>
            
            <Link 
              to="/agency/organizations" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/agency/organizations') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary'
              } transition-colors`}
            >
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Organizations</span>
              </div>
            </Link>
            
            <Link 
              to="/agency/certificates" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/agency/certificates') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary'
              } transition-colors`}
            >
              <div className="flex items-center space-x-1">
                <Upload className="h-4 w-4" />
                <span>Certificates</span>
              </div>
            </Link>
            
            <Link 
              to="/agency/qr-codes" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/agency/qr-codes') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary'
              } transition-colors`}
            >
              <div className="flex items-center space-x-1">
                <QrCode className="h-4 w-4" />
                <span>QR Codes</span>
              </div>
            </Link>
            
            <Link 
              to="/agency/reports" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/agency/reports') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary'
              } transition-colors`}
            >
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>Reports</span>
              </div>
            </Link>
            
            <Button 
              variant="outline" 
              className="ml-4 flex items-center" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/agency/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/agency/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </div>
            </Link>
            
            <Link 
              to="/agency/organizations"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/agency/organizations') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Organizations
              </div>
            </Link>
            
            <Link 
              to="/agency/certificates"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/agency/certificates') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Certificates
              </div>
            </Link>
            
            <Link 
              to="/agency/qr-codes"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/agency/qr-codes') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <QrCode className="h-4 w-4 mr-2" />
                QR Codes
              </div>
            </Link>
            
            <Link 
              to="/agency/reports"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/agency/reports') ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </div>
            </Link>
            
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
            >
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AgencyNavbar;
