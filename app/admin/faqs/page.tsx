import { getFaqs } from "@/actions/admin/faqs";
import FaqsClient from "./FaqsClient";

export default async function FaqsPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getFaqs(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load FAQs.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>
      <FaqsClient 
        initialData={data || []} 
        totalPages={totalPages || 1} 
        initialPage={page} 
        initialSearch={search} 
      />
    </div>
  );
}
