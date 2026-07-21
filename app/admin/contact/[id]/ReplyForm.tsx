"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { replyToContact, updateContactStatus } from "@/actions/admin/contact";
import { toast } from "react-hot-toast";

const replySchema = z.object({
  replyText: z.string().min(10, "Reply must be at least 10 characters"),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function ReplyForm({ messageId, email }: { messageId: string, email: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
  });

  const onSubmit = async (data: ReplyFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await replyToContact(messageId, data.replyText);
      if (res.success) {
        toast.success("Reply sent successfully");
        reset();
      } else {
        toast.error(res.error || "Failed to send reply");
      }
    } catch {
      toast.error("Error sending reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsRead = async () => {
    const res = await updateContactStatus(messageId, "read");
    if (res.success) {
      toast.success("Marked as read");
    } else {
      toast.error(res.error || "Failed to mark as read");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reply to {email}</label>
        <textarea
          {...register("replyText")}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Type your reply here..."
        />
        {errors.replyText && <p className="text-red-500 text-sm mt-1">{errors.replyText.message}</p>}
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Reply"}
        </button>
        <button
          type="button"
          onClick={markAsRead}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          Mark as Read
        </button>
      </div>
    </form>
  );
}
