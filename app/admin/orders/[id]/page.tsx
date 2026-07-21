import { getOrderById } from "@/actions/admin/orders";
import { notFound } from "next/navigation";
import OrderDetailsClient from "./OrderDetailsClient";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data, success } = await getOrderById(resolvedParams.id);
  
  if (!success || !data) {
    return notFound();
  }

  return <OrderDetailsClient initialData={data} />;
}
