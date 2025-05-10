
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from '@/components/ui/use-toast';
import { Printer, Download, Calendar } from 'lucide-react';

// Mock data for reports
const monthlyData = [
  { month: 'Jan', certificates: 65, verifications: 78 },
  { month: 'Feb', certificates: 75, verifications: 90 },
  { month: 'Mar', certificates: 85, verifications: 120 },
  { month: 'Apr', certificates: 70, verifications: 85 },
  { month: 'May', certificates: 90, verifications: 110 },
  { month: 'Jun', certificates: 95, verifications: 125 },
];

const organizationData = [
  { name: 'University of Technology', value: 540 },
  { name: 'Global Institute', value: 320 },
  { name: 'EduCert Academy', value: 280 },
  { name: 'Professional Training Center', value: 180 },
  { name: 'Academic Excellence', value: 120 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportsPage = () => {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  const handleGenerateReport = () => {
    if (!selectedOrganization) {
      toast({
        title: "Missing Information",
        description: "Please select an organization to generate a report.",
        variant: "destructive",
      });
      return;
    }

    if (!dateRange.start || !dateRange.end) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end dates for the report.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
    }, 2000);
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download Started",
      description: "Your report is being prepared for download as PDF.",
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Your report has been downloaded successfully.",
      });
    }, 1500);
  };

  const handlePrintReport = () => {
    toast({
      title: "Print Prepared",
      description: "Your report is ready to print.",
    });
    
    // In a real app, this would trigger browser print
    window.print();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>
              Select parameters to generate a custom report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="organization" className="text-sm font-medium">
                  Organization
                </label>
                <select
                  id="organization"
                  className="w-full p-2 border rounded-md"
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                >
                  <option value="">Select Organization</option>
                  <option value="all">All Organizations</option>
                  <option value="University of Technology">University of Technology</option>
                  <option value="Global Institute">Global Institute</option>
                  <option value="EduCert Academy">EduCert Academy</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    className="w-full p-2 border rounded-md pl-10"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="endDate"
                    className="w-full p-2 border rounded-md pl-10"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {reportGenerated ? (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>Report Results</CardTitle>
                <CardDescription>
                  {selectedOrganization === 'all' 
                    ? 'All Organizations' 
                    : selectedOrganization} | {dateRange.start} to {dateRange.end}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrintReport}>
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Certificates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="text-2xl font-bold">1,245</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Verifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="text-2xl font-bold">3,872</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Success Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="text-2xl font-bold">99.8%</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="certificates" name="Certificates Issued" fill="#2563eb" />
                            <Bar dataKey="verifications" name="Verifications" fill="#06b6d4" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Organization Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={organizationData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {organizationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} certificates`, 'Count']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Verification Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">From Web UI</p>
                            <p className="text-lg font-medium">2,354</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">From Mobile</p>
                            <p className="text-lg font-medium">1,518</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Via QR Scan</p>
                            <p className="text-lg font-medium">3,128</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Via API</p>
                            <p className="text-lg font-medium">744</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="md:col-span-2 flex items-center justify-center rounded-lg border-2 border-dashed p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Report Selected</h3>
              <p className="text-sm text-gray-500 mb-4">
                Select an organization and date range, then generate a report to view analytics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
