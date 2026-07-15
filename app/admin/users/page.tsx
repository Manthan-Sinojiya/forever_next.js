import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, UserCheck, MoreHorizontal, User as UserIcon } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export const metadata = { title: "Admin Customers | Forever Healthcare" };

interface CustomerItem {
  name: string;
  email: string;
  joined: string;
  ordersCount: number;
  spent: number;
  role: string;
  initials: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await dbConnect();
  
  // Resolve search query
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q || "";

  // Fetch users from database
  let usersFilter = {};
  if (searchQuery) {
    usersFilter = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }
  
  const rawUsers = await User.find(usersFilter).sort({ createdAt: -1 });

  // Calculate order count and total spent for each user
  const customers: CustomerItem[] = [];
  let totalSpentSum = 0;
  let activeUsersCount = 0;

  for (const user of rawUsers) {
    const userOrders = await Order.find({ userEmail: user.email });
    const spent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const ordersCount = userOrders.length;
    
    totalSpentSum += spent;
    if (ordersCount > 0 || user.role === "admin") {
      activeUsersCount++;
    }

    const nameParts = user.name.split(" ");
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : nameParts[0].slice(0, 2).toUpperCase();

    customers.push({
      name: user.name,
      email: user.email,
      joined: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      ordersCount,
      spent,
      role: user.role,
      initials,
    });
  }

  // Calculate stats
  const totalCustomers = await User.countDocuments();
  const averageSpent = totalCustomers > 0 ? totalSpentSum / totalCustomers : 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar active="Customers" />

      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-slate-800">Customer Accounts</h1>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">
            {customers.length} Customers Found
          </span>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Customers", value: String(totalCustomers), change: "Registered in database" },
              { label: "Active Customers", value: String(activeUsersCount), change: "Placed at least 1 order" },
              { label: "Avg. Customer Spend", value: `₹${averageSpent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, change: "Lifetime average spend" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-450 font-semibold mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1.5">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Search form */}
          <form method="GET" className="relative max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 w-full outline-none text-sm focus:border-emerald-600/30 transition-colors"
            />
          </form>

          {/* Customers Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-400">Customer</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-400">Joined</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-400">Orders</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-400">Total Spent</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-400">Role</th>
                    <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider text-slate-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr key={customer.email} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black shrink-0`}>
                            {customer.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{customer.name}</p>
                            <p className="text-xs text-slate-400 font-semibold">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-semibold">{customer.joined}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{customer.ordersCount}</td>
                      <td className="px-5 py-3.5 font-black text-emerald-650 text-emerald-600">₹{customer.spent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          customer.role === "admin"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-150 bg-emerald-100 text-emerald-800"
                        }`}>
                          {customer.role === "admin" && <UserIcon className="w-3 h-3" />}
                          {customer.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                        <UserCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="font-bold">No customers found</p>
                        <p className="text-xs mt-1">Try modifying your search or check your database connection.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
