import React from "react";
import { getContactMessage } from "@/actions/admin/contact";
import ReplyForm from "./ReplyForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ContactMessagePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const message = await getContactMessage(resolvedParams.id);
  if (!message) return notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/contact" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Message Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">From</p>
            <p className="text-gray-900">{message.fullName} ({message.email})</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Date</p>
            <p className="text-gray-900">{new Date(message.createdAt).toLocaleString()}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 font-medium">Subject</p>
            <p className="text-gray-900 font-medium">{message.subject}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 font-medium">Message</p>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500 font-medium">Status</p>
            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
              message.status === "new" ? "bg-blue-100 text-blue-800" :
              message.status === "replied" ? "bg-green-100 text-green-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {message.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Reply via Email</h2>
        <ReplyForm messageId={message._id} email={message.email} />
      </div>
    </div>
  );
}
