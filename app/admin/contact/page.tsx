import React from "react";
import { getContactMessages } from "@/actions/admin/contact";
import ContactClient from "./ContactClient";

export default async function ContactPage() {
  const messages = await getContactMessages();

  return <ContactClient data={messages} />;
}
