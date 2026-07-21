"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Home as HomeIcon } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface SettingsMap {
  [key: string]: string;
}

export default function AdminHomepageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsMap>({
    homepage_seo_text: "",
    homepage_custom_title: "",
    homepage_custom_content: "",
    homepage_standards_title: "Uncompromising Standards",
    homepage_standards_content: "",
  });

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const newSettings = { ...settings };
        data.data.forEach((s: any) => {
          if (newSettings[s.key] !== undefined) {
            newSettings[s.key] = s.value;
          }
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Failed to fetch homepage settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        alert("Homepage settings updated successfully!");
      } else {
        alert("Failed to update settings: " + data.error);
      }
    } catch (error) {
      console.error("Error saving homepage settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <HomeIcon className="w-5 h-5 text-[#05b67a]" />
            <h1 className="text-xl font-bold font-heading text-slate-800">Homepage CMS</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#05b67a] text-white rounded-full font-bold text-sm hover:bg-[#049665] transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-[#05b67a]/20"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1 max-w-5xl mx-auto w-full space-y-8">
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="space-y-8 pb-10">
              
              {/* Uncompromising Standards Section */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-lg font-bold font-heading text-slate-800 mb-1">Uncompromising Standards Section</h2>
                <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">Display your brand's core standards securely on the homepage.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c728e] uppercase tracking-wider mb-2">Section Title</label>
                    <input
                      value={settings.homepage_standards_title}
                      onChange={(e) => setSettings({ ...settings, homepage_standards_title: e.target.value })}
                      type="text"
                      className="w-full px-5 py-3 rounded-full bg-[#f8f9fa] border-none focus:ring-2 focus:ring-[#05b67a]/30 outline-none text-sm font-semibold text-slate-700"
                      placeholder="e.g. Uncompromising Standards"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c728e] uppercase tracking-wider mb-2">Section Content (Rich Text)</label>
                    <RichTextEditor 
                      value={settings.homepage_standards_content}
                      onChange={(val) => setSettings({ ...settings, homepage_standards_content: val })}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Homepage Section */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-lg font-bold font-heading text-slate-800 mb-1">Custom Dynamic Section</h2>
                <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">Add an entirely custom block of text/images to the middle of the homepage.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c728e] uppercase tracking-wider mb-2">Section Title</label>
                    <input
                      value={settings.homepage_custom_title}
                      onChange={(e) => setSettings({ ...settings, homepage_custom_title: e.target.value })}
                      type="text"
                      className="w-full px-5 py-3 rounded-full bg-[#f8f9fa] border-none focus:ring-2 focus:ring-[#05b67a]/30 outline-none text-sm font-semibold text-slate-700"
                      placeholder="e.g. Why Ayurveda is Best for You"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c728e] uppercase tracking-wider mb-2">Section Content (Rich Text)</label>
                    <RichTextEditor 
                      value={settings.homepage_custom_content}
                      onChange={(val) => setSettings({ ...settings, homepage_custom_content: val })}
                    />
                  </div>
                </div>
              </div>

              {/* SEO Text */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                <h2 className="text-lg font-bold font-heading text-slate-800 mb-1">Homepage SEO Content</h2>
                <p className="text-xs text-slate-500 mb-6 pb-4 border-b border-slate-100">Add extensive SEO text at the bottom of the homepage for search engine crawlers.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c728e] uppercase tracking-wider mb-2">SEO Content (Rich Text)</label>
                    <RichTextEditor 
                      value={settings.homepage_seo_text}
                      onChange={(val) => setSettings({ ...settings, homepage_seo_text: val })}
                    />
                  </div>
                </div>
              </div>

            )}
        </div>
      </main>
    
  );
}
