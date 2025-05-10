
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { monthlyStats } from '@/lib/mockData';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ActivityGraph = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Monthly Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyStats}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCertificates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopColor="#2563eb30" />
                  <stop offset="95%" stopColor="#2563eb" stopColor="#2563eb00" />
                </linearGradient>
                <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopColor="#06b6d430" />
                  <stop offset="95%" stopColor="#06b6d4" stopColor="#06b6d400" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                padding={{ left: 15, right: 15 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="certificates"
                name="Certificates Issued"
                stroke="#2563eb"
                fillOpacity={0.2}
                fill="url(#colorCertificates)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="verifications"
                name="Verifications"
                stroke="#06b6d4"
                fillOpacity={0.2}
                fill="url(#colorVerifications)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityGraph;
