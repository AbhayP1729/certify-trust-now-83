
import { Button } from '@/components/ui/button';
import DashboardStats from '@/components/agency/DashboardStats';
import RecentActivity from '@/components/agency/RecentActivity';
import ActivityGraph from '@/components/agency/ActivityGraph';
import { useNavigate } from 'react-router-dom';
import AgencyNavbar from '@/components/agency/AgencyNavbar';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  
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
      <AgencyNavbar />
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
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
                  <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  New Certificate
                </Button>
                <Button 
                  className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => handleQuickAction('add-organization')}
                >
                  <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Add Organization
                </Button>
                <Button 
                  className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => handleQuickAction('generate-qr')}
                >
                  <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Generate QR
                </Button>
                <Button 
                  className="h-24 flex flex-col items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => handleQuickAction('generate-report')}
                >
                  <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
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
      </div>
    </div>
  );
};

export default AgencyDashboard;
