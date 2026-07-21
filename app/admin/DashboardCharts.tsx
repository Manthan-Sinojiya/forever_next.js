"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const monthlySalesData = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 2000 },
  { name: 'Apr', total: 2780 },
  { name: 'May', total: 1890 },
  { name: 'Jun', total: 2390 },
  { name: 'Jul', total: 3490 },
  { name: 'Aug', total: 4200 },
  { name: 'Sep', total: 3800 },
  { name: 'Oct', total: 4900 },
];

const orderStatusData = [
  { name: 'Completed', value: 400 },
  { name: 'Processing', value: 300 },
  { name: 'Pending', value: 300 },
  { name: 'Refunded', value: 100 },
];

// Refined, softer color palette for the minimal white theme
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
      <Card className="col-span-1 lg:col-span-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="pb-2 bg-white rounded-t-xl">
          <CardTitle className="text-lg font-bold text-gray-900">Revenue Growth</CardTitle>
          <p className="text-sm text-gray-500 font-medium">Monthly sales performance over the year</p>
        </CardHeader>
        <CardContent className="pl-0 pr-4 bg-white rounded-b-xl">
          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10} 
                  fontWeight={500}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`}
                  dx={-10}
                  fontWeight={500}
                />
                <Tooltip 
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                  contentStyle={{
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -1px rgb(0 0 0 / 0.03)',
                    backgroundColor: '#ffffff',
                  }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  activeDot={{ r: 6, fill: "#ffffff", stroke: "#4f46e5", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-3 bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="pb-2 bg-white rounded-t-xl">
          <CardTitle className="text-lg font-bold text-gray-900">Order Distribution</CardTitle>
          <p className="text-sm text-gray-500 font-medium">Current status of all orders</p>
        </CardHeader>
        <CardContent className="bg-white rounded-b-xl">
          <div className="h-[320px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -1px rgb(0 0 0 / 0.03)',
                    backgroundColor: '#ffffff'
                  }}
                  itemStyle={{ color: '#111827', fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-gray-600 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
