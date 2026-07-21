"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";

export default function FooterBuilderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      columns: [
        {
          title: "Quick Links",
          type: "Link List",
          links: [
            { label: "Home", url: "/" },
            { label: "Shop", url: "/shop" }
          ]
        },
        {
          title: "New Column",
          type: "Link List",
          links: [
            { label: "New Link", url: "/" }
          ]
        }
      ],
      bottomBar: {
        copyright: "© 2026 Forever Healthcare",
        showPaymentIcons: true
      }
    }
  });

  const { fields: columns, append: addColumn, remove: removeColumn } = useFieldArray({
    control,
    name: "columns"
  });

  const onSubmit = async (_data: any) => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      // Mock save
      await new Promise(r => setTimeout(r, 1000));
      setMessage({ type: "success", text: "Footer configuration has been saved successfully." });
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred while saving." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Footer Builder</h1>
            <p className="text-slate-500 mt-1">Manage your storefront footer layout and navigation links.</p>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 disabled:opacity-70 font-medium transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Footer"}
          </button>
        </div>

        {message.text && (
          <div className={`flex items-center gap-2 p-4 rounded-xl text-sm border font-medium ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {message.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {message.text}
          </div>
        )}

        {/* Footer Columns */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Footer Columns Structure</h3>
            <button
              type="button"
              onClick={() => addColumn({ title: "New Column", type: "Link List", links: [] })}
              className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-800 text-sm font-semibold transition-colors bg-indigo-50 hover:bg-indigo-100 rounded-lg px-4 py-2 border border-indigo-100"
            >
              <Plus size={16} /> Add Column
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-6 items-start">
              {columns.map((column, colIndex) => (
                <div key={column.id} className="w-full md:w-[320px] border border-slate-200 rounded-xl bg-white shadow-sm hover:border-indigo-200 transition-colors group">
                  
                  <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 rounded-t-xl">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm cursor-ns-resize">
                      <GripVertical size={16} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      Column {colIndex + 1}
                    </div>
                    <button type="button" onClick={() => removeColumn(colIndex)} className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded hover:bg-rose-50">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-4 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Column Title</label>
                      <input 
                        {...register(`columns.${colIndex}.title`)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        placeholder="e.g. Quick Links"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Widget Type</label>
                      <select 
                        {...register(`columns.${colIndex}.type`)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white"
                      >
                        <option value="Link List">Link List</option>
                        <option value="Text Block">Text Block</option>
                        <option value="Newsletter">Newsletter Form</option>
                      </select>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <ColumnLinks control={control} register={register} colIndex={colIndex} />
                    </div>
                  </div>
                </div>
              ))}
              
              {columns.length === 0 && (
                <div className="w-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <p className="text-slate-500 font-medium">No columns added yet. Click "Add Column" to start building your footer.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar & Social */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Bottom Bar Configuration</h3>
          </div>
          
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Copyright Text</label>
              <input 
                {...register("bottomBar.copyright")}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="© 2026 Your Brand"
              />
            </div>
            
            <div className="flex flex-col justify-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    {...register("bottomBar.showPaymentIcons")}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">Show Payment Icons</span>
                  <span className="text-xs text-slate-500">Display Visa, Mastercard, Razorpay icons in the bottom right</span>
                </div>
              </label>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

// Sub-component to handle nested field array for links
function ColumnLinks({ control, register, colIndex }: { control: any, register: any, colIndex: number }) {
  const { fields: links, append, remove } = useFieldArray({
    control,
    name: `columns.${colIndex}.links`
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Navigation Links</label>
        <button
          type="button"
          onClick={() => append({ label: "", url: "" })}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors bg-indigo-50 px-2 py-1 rounded-md"
        >
          <Plus size={14} /> Add Link
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link, linkIndex) => (
          <div key={link.id} className="flex items-start gap-2 border border-slate-100 rounded-lg p-2.5 bg-slate-50 group">
            <div className="flex-1 space-y-2.5">
              <input 
                {...register(`columns.${colIndex}.links.${linkIndex}.label`)}
                placeholder="Link Label (e.g. About Us)"
                className="w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-shadow bg-white"
              />
              <input 
                {...register(`columns.${colIndex}.links.${linkIndex}.url`)}
                placeholder="URL (e.g. /about)"
                className="w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-shadow bg-white text-indigo-600"
              />
            </div>
            <button type="button" onClick={() => remove(linkIndex)} className="text-slate-400 hover:text-rose-600 mt-1 p-1.5 rounded hover:bg-rose-50 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {links.length === 0 && (
          <div className="text-center py-4 bg-slate-50 border border-slate-100 rounded-lg border-dashed">
            <span className="text-xs text-slate-400 font-medium">No links added.</span>
          </div>
        )}
      </div>
    </div>
  );
}
