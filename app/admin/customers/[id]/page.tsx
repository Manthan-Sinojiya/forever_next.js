import { getCustomerDetails } from "@/actions/admin/customers";
import { notFound } from "next/navigation";
import CustomerDetailsClient from "./CustomerDetailsClient";

export default async function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const { data, success } = await getCustomerDetails(params.id);
  
  if (!success || !data) {
    return notFound();
  }

  return <CustomerDetailsClient initialData={data} />;
}
