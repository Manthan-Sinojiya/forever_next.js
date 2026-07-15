"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/911234567890?text=Hello%20Forever%20Healthcare!"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float no-print"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" fill="white" />
    </a>
  );
}
