import { getTestimonials } from "@/actions/admin/testimonials";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
  const params = await searchParams;
  const search = params?.search || "";
  const page = parseInt(params?.page || "1", 10);
  const limit = 10;

  const { data, totalPages, success } = await getTestimonials(search, page, limit);

  if (!success) {
    return <div className="p-4">Failed to load testimonials.</div>;
  }

  return (
    <TestimonialsClient 
      initialData={data || []} 
      totalPages={totalPages || 1} 
      initialPage={page} 
      initialSearch={search} 
    />
  );
}
