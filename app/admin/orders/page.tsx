import { getOrders } from "@/actions/admin/orders";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getOrders(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load orders.</div>;
  }

  return (
    <OrdersClient 
      initialData={data || []} 
      totalPages={totalPages || 1} 
      initialPage={page} 
      initialSearch={search} 
    />
  );
}
