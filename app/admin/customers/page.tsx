import { getCustomers } from "@/actions/admin/customers";
import CustomersClient from "./CustomersClient";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getCustomers(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load customers.</div>;
  }

  return (
    <CustomersClient 
      initialData={data || []} 
      totalPages={totalPages || 1} 
      initialPage={page} 
      initialSearch={search} 
    />
  );
}
