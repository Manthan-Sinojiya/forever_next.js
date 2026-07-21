import { getCustomPages } from "@/actions/admin/customPages";
import CustomPagesClient from "./CustomPagesClient";

export default async function CustomPagesPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getCustomPages(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load custom pages.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Custom Pages</h1>
      <CustomPagesClient 
        initialData={data || []} 
        totalPages={totalPages || 1} 
        initialPage={page} 
        initialSearch={search} 
      />
    </div>
  );
}
