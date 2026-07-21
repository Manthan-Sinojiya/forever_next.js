import { redirect } from "next/navigation";

/**
 * /orders is not a standalone page.
 * User order history lives under the Profile page (Orders tab).
 * This redirect ensures navigating to /orders works correctly.
 */
export default function OrdersPage() {
  redirect("/profile?tab=Orders");
}
