import { getProductById } from "@/actions/admin/products";
import EditProductClient from "./EditProductClient";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data, success } = await getProductById(resolvedParams.id);
  
  if (!success || !data) {
    return notFound();
  }

  return <EditProductClient initialData={data} />;
}
