import { getCategoryById } from "@/actions/admin/categories";
import CategoryEditForm from "./CategoryEditForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, success } = await getCategoryById(id);

  if (!success || !data) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <CategoryEditForm initialData={data} id={id} />
    </div>
  );
}
