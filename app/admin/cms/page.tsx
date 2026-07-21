import { getCmsSections } from "@/actions/admin/cms";
import CmsClient from "./CmsClient";

export default async function CmsPage() {
  const { data, success } = await getCmsSections();

  if (!success) {
    return <div className="p-4">Failed to load CMS sections.</div>;
  }

  return (
    <div className="p-0">
      <CmsClient initialData={data || []} />
    </div>
  );
}
