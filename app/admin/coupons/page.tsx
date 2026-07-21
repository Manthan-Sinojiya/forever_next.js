import { getCoupons } from "@/actions/admin/coupons";
import CouponsClient from "./CouponsClient";

export default async function CouponsPage() {
  const { data = [] } = await getCoupons();

  return <CouponsClient initialData={data} />;
}
