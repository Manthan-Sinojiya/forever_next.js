import { getDashboardMetrics, getRecentOrders } from "@/actions/admin/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle, ArrowUpRight, ArrowRight, Package, ShoppingCart, Tag } from "lucide-react";
import { RecentOrdersTable } from "./RecentOrdersTable";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();
  const recentOrders = await getRecentOrders();

  const kpis = [
    {
      title: "Total Revenue",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      subtext: "+12.5% from last month",
      icon: DollarSign,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Orders",
      value: metrics.totalOrders.toString(),
      subtext: "+8.2% from last month",
      icon: ShoppingBag,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Customers",
      value: metrics.totalCustomersCount.toString(),
      subtext: "+14.1% from last month",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Now",
      value: "38",
      subtext: "Real-time active users",
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-50",
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Overview
          </h2>
          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm shadow-sm">
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm shadow-indigo-200">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
              </span>
              <p className="text-sm text-slate-500">{kpi.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Recent Sales - Takes up 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
              <p className="text-sm text-slate-500 mt-1">Latest transactions from your store</p>
            </div>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex-1 p-0 overflow-hidden">
             <RecentOrdersTable orders={recentOrders} />
          </div>
        </div>

        {/* Right Column - Alerts & Activity */}
        <div className="space-y-8">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Inventory Alerts
              </h3>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px] bg-slate-50/50">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm shadow-emerald-200/50">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="text-slate-900 font-semibold mb-1">Stock is healthy</h4>
              <p className="text-sm text-slate-500 max-w-[200px]">
                All your products are currently well stocked.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link href="/admin/products/new" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-colors text-slate-600 hover:text-indigo-700">
                <Package className="w-6 h-6" />
                <span className="text-sm font-medium">Add Product</span>
              </Link>
              <Link href="/admin/orders" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 transition-colors text-slate-600 hover:text-emerald-700">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-sm font-medium">Manage Orders</span>
              </Link>
              <Link href="/admin/coupons" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 transition-colors text-slate-600 hover:text-rose-700">
                <Tag className="w-6 h-6" />
                <span className="text-sm font-medium">Create Coupon</span>
              </Link>
              <Link href="/admin/settings" className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 transition-colors text-slate-600 hover:text-blue-700">
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Manage Users</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
