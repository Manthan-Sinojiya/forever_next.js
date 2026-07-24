import { getCustomerDetails } from "@/actions/admin/customers";
import { notFound } from "next/navigation";
import CustomerDetailsClient from "./CustomerDetailsClient";

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, success } = await getCustomerDetails(id);
  
  if (!success || !data) {
    return notFound();
  }

  return <CustomerDetailsClient initialData={data} />;
}
