
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/agency/DashboardStats';
import RecentActivity from '@/components/agency/RecentActivity';
import ActivityGraph from '@/components/agency/ActivityGraph';
import { Menu, User, LogOut, Home, FileText, Upload, QrCode, BarChart3, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AgencyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, this would clear auth state
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-certificate':
        navigate('/agency/certificates');
        break;
      case 'add-organization':
        navigate('/agency/organizations');
        break;
      case 'generate-qr':
        navigate('/agency/qr-codes');
        break;
      case 'generate-report':
        navigate('/agency/reports');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <Link to="/" className="flex items-center">
              <img src="/src/assets/blockchain.svg" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">CertifyTrust</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              <Link to="/agency/dashboard" className="flex items-center px-4 py-2 text-primary bg-primary/10 rounded-md group">
                <Home className="mr-3 h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <Link to="/agency/organizations" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md group">
                <FileText className="mr-3 h-5 w-5" />
                <span className="font-medium">Organizations</span>
              </Link>
              
              <Link to="/agency/certificates" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md group">
                <Upload className="mr-3 h-5 w-5" />
                <span className="font-medium">Certificates</span>
              </Link>
              
              <Link to="/agency/qr-codes" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md group">
                <QrCode className="mr-3 h-5 w-5" />
                <span className="font-medium">QR Codes</span>
              </Link>
              
              <Link to="/agency/reports" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md group">
                <BarChart3 className="mr-3 h-5 w-5" />
                <span className="font-medium">Reports</span>
              </Link>
            </nav>
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-xs text-gray-500 hover:text-primary mt-1"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign out
                </button>
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`${sidebarOpen ? 'md:pl-64' : ''} flex flex-col min-h-screen transition-all duration-300`}>
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center px-4 md:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-2 md:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2">
                <h2 className="text-lg font-semibold mb-4">Overview</h2>
                <DashboardStats />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={() => handleQuickAction('new-certificate')}
                  >
                    <Upload className="h-6 w-6 mb-1" />
                    New Certificate
                  </Button>
                  <Button 
                    className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={() => handleQuickAction('add-organization')}
                  >
                    <FileText className="h-6 w-6 mb-1" />
                    Add Organization
                  </Button>
                  <Button 
                    className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={() => handleQuickAction('generate-qr')}
                  >
                    <QrCode className="h-6 w-6 mb-1" />
                    Generate QR
                  </Button>
                  <Button 
                    className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                    onClick={() => handleQuickAction('generate-report')}
                  >
                    <BarChart3 className="h-6 w-6 mb-1" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <ActivityGraph />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgencyDashboard;
