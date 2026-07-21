import React from "react";
import { getSubscribers } from "@/actions/admin/newsletter";
import NewsletterClient from "./NewsletterClient";

export default async function NewsletterPage() {
  const data = await getSubscribers();

  return <NewsletterClient data={data} />;
}
