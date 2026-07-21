import { getBanners } from "@/actions/admin/banners";
import BannersClient from "./BannersClient";

export default async function BannersPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getBanners(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load banners.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Banners</h1>
      <BannersClient 
        initialData={data || []} 
        totalPages={totalPages || 1} 
        initialPage={page} 
        initialSearch={search} 
      />
    </div>
  );
}
