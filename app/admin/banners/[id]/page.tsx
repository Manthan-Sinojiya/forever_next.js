import { getBannerById } from "@/actions/admin/banners";
import BannerForm from "../BannerForm";
import { notFound } from "next/navigation";

interface EditBannerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const res = await getBannerById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <BannerForm initialData={res.data} isEditing={true} />;
}
