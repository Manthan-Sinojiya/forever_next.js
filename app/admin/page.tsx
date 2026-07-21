import { ShoppingBag, PackageSearch, Activity, TrendingUp, ArrowUpRight, Users, CheckCircle2, Clock } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Image from "next/image";

export const metadata = { title: "Forever Healthcare Admin Dashboard" };

export default async function AdminDashboard() {
  await dbConnect();
  
  // Fetch real counts/data from Mongoose
  const productsCount = await Product.countDocuments();
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
  const totalOrdersCount = await Order.countDocuments();
  
  // Calculate total revenue
  const allOrders = await Order.find({});
  const revenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  // Get recent 5 products
  const recentProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);

  const stats = [
    { label: "Total Revenue", value: `₹${revenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`, change: "From placed orders", icon: <TrendingUp className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Orders", value: String(totalOrdersCount), change: "Active COD orders", icon: <ShoppingBag className="w-5 h-5" />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Products", value: String(productsCount), change: "Supplements & equipment", icon: <PackageSearch className="w-5 h-5" />, color: "bg-violet-50 text-violet-600" },
    { label: "Loyal Customers", value: "1", change: "John Doe (Demo)", icon: <Users className="w-5 h-5" />, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar active="Dashboard" />

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold font-heading text-slate-800">Dashboard Overview</h1>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">Admin User</span>
        </header>

        <div className="p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
                </div>
                <p className="text-xs font-bold text-emerald-600">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders Panel */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-heading text-slate-850">Recent Orders</h3>
                <Link href="/admin/orders" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  Manage Orders <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Order No.</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Customer</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Amount</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.map((order) => (
                      <tr key={order._id.toString()}>
                        <td className="py-3.5 font-mono font-extrabold text-slate-700">{order.orderNumber}</td>
                        <td className="py-3.5 text-slate-500 font-bold">{order.shippingAddress.fullName}</td>
                        <td className="py-3.5 font-black text-slate-800">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.status === "Pending" ? "bg-amber-100 text-amber-800" :
                            order.status === "Dispatched" ? "bg-blue-100 text-blue-800" :
                            order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">No orders placed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Products Panel */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-heading text-slate-850">Recent Products</h3>
                <Link href="/admin/products" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  Manage Products <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Product</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Category</th>
                      <th className="pb-3 font-semibold text-xs uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentProducts.map((p) => (
                      <tr key={p._id.toString()}>
                        <td className="py-3 text-slate-700 font-bold flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-50 border shrink-0">
                            <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                          </div>
                          <span className="truncate max-w-[150px]">{p.name}</span>
                        </td>
                        <td className="py-3 text-slate-500 font-semibold">{p.category.toString()}</td>
                        <td className="py-3 font-black text-emerald-600">₹{p.price}</td>
                      </tr>
                    ))}
                    {recentProducts.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 text-xs">No products in database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
