import { getReviews } from "@/actions/admin/reviews";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const { data = [] } = await getReviews();

  return <ReviewsClient initialData={data} />;
}
