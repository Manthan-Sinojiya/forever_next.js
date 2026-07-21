"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Save, Loader2, MessageSquare } from "lucide-react";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

interface FAQForm {
  _id?: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

const emptyForm: FAQForm = {
  question: "",
  answer: "",
  category: "",
  isActive: true,
};

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [saving, setSaving] = useState(false);
  const [formFAQ, setFormFAQ] = useState<FAQForm>(emptyForm);

  const fetchFAQs = async () => {
    try {
      const response = await fetch("/api/faqs");
      const data = await response.json();
      if (data.success) setFaqs(data.data);
    } catch (error) {
      console.error("Failed to fetch faqs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) setFaqs(faqs.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEditClick = (c: FAQ) => {
    setFormFAQ({
      _id: c._id,
      question: c.question,
      answer: c.answer,
      category: c.category || "",
      isActive: c.isActive,
    });
    setFormMode("edit");
    setIsAdding(true);
  };

  const handleStartAdd = () => {
    setFormFAQ(emptyForm);
    setFormMode("add");
    setIsAdding(true);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setFormFAQ(emptyForm);
  };

  const handleSubmitFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        question: formFAQ.question,
        answer: formFAQ.answer,
        category: formFAQ.category,
        isActive: formFAQ.isActive,
      };

      if (formMode === "add") {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setFaqs([...faqs, data.data]);
          setIsAdding(false);
          setFormFAQ(emptyForm);
        } else {
          alert(data.error);
        }
      } else {
        const res = await fetch(`/api/faqs/${formFAQ._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setFaqs(faqs.map((c) => (c._id === formFAQ._id ? data.data : c)));
          setIsAdding(false);
          setFormFAQ(emptyForm);
        } else {
          alert(data.error);
        }
      }
    } catch (error) {
      console.error("Error saving FAQ:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <h1 className="text-xl font-bold font-heading text-foreground">FAQ Management</h1>
          <button
            onClick={() => {
              if (isAdding) handleCancelForm();
              else handleStartAdd();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              isAdding
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-emerald-650 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
            }`}
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Add FAQ"}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1">
          {isAdding && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold font-heading text-slate-800 mb-5 pb-4 border-b border-slate-100">
                {formMode === "add" ? "Add New FAQ" : "Edit FAQ"}
              </h2>
              <form onSubmit={handleSubmitFAQ} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Question *</label>
                    <input
                      required
                      value={formFAQ.question}
                      onChange={(e) => setFormFAQ({ ...formFAQ, question: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. How long does shipping take?"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Category *</label>
                    <input
                      value={formFAQ.category}
                      required
                      onChange={(e) => setFormFAQ({ ...formFAQ, category: e.target.value })}
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium"
                      placeholder="e.g. Shipping, General, Payment"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Answer *</label>
                  <textarea
                    required
                    value={formFAQ.answer}
                    onChange={(e) => setFormFAQ({ ...formFAQ, answer: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600/30 outline-none text-sm font-medium resize-none"
                    placeholder="Enter the detailed answer..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100/70 p-3 rounded-xl transition-all border border-slate-100 w-max">
                    <input
                      type="checkbox"
                      checked={formFAQ.isActive}
                      onChange={(e) => setFormFAQ({ ...formFAQ, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider select-none">Active (Visible to users)</span>
                  </label>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-650 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save FAQ</>}
                  </button>
                </div>
              </form>
            )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No FAQs Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">Create FAQs to help your users navigate the store better.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Question</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {faqs.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-sm text-slate-800">{c.question}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{c.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {c.isActive ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    
  );
}
