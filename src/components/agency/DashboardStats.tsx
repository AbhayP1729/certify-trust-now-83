
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { agencyStats } from '@/lib/mockData';
import { Building, FileCheck, QrCode, Search } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const StatCard = ({ title, value, description, icon, trend, color }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="mt-2 text-xs font-medium text-green-600">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Organizations"
        value={agencyStats.organizations}
        description="Total connected institutions"
        icon={<Building className="h-4 w-4 text-blue-700" />}
        color="bg-blue-100"
        trend="+12% from last month"
      />
      <StatCard
        title="Certificates"
        value={agencyStats.certificates}
        description="Total certificates issued"
        icon={<FileCheck className="h-4 w-4 text-emerald-700" />}
        color="bg-emerald-100"
        trend="+8.2% from last month"
      />
      <StatCard
        title="Verifications"
        value={agencyStats.verifications}
        description="Successful verifications"
        icon={<Search className="h-4 w-4 text-purple-700" />}
        color="bg-purple-100"
        trend="+24% from last month"
      />
      <StatCard
        title="QR Codes"
        value={agencyStats.qrCodes}
        description="QR codes generated"
        icon={<QrCode className="h-4 w-4 text-amber-700" />}
        color="bg-amber-100"
      />
    </div>
  );
};

export default DashboardStats;
