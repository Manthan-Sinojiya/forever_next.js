"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSettings() {
  const [announcement, setAnnouncement] = useState("");
  const [announcementBg, setAnnouncementBg] = useState("#0a8c6e");
  const [announcementStyle, setAnnouncementStyle] = useState("static");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const colorPresets = [
    { name: "Brand Green", value: "#0a8c6e" },
    { name: "Amber Gold", value: "#eab308" },
    { name: "Rose Pink", value: "#f43f5e" },
    { name: "Sleek Dark", value: "#0f172a" },
    { name: "Royal Blue", value: "#2563eb" },
  ];

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const textSetting = data.data.find((s: any) => s.key === "announcement");
          const bgSetting = data.data.find((s: any) => s.key === "announcement_bg");
          const styleSetting = data.data.find((s: any) => s.key === "announcement_style");

          if (textSetting?.value) setAnnouncement(textSetting.value);
          if (bgSetting?.value) setAnnouncementBg(bgSetting.value);
          if (styleSetting?.value) setAnnouncementStyle(styleSetting.value);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading settings:", err);
        setAnnouncement("🎉 Free shipping on all orders above ₹499! Use code: EXTRA10 for 10% off");
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcement: announcement.trim(),
          announcement_bg: announcementBg,
          announcement_style: announcementStyle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: "Settings saved successfully! Refresh the page to see changes." });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to update settings" });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to connect to API" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <main className="flex-1 overflow-auto">
        {/* Main Container */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold font-heading text-slate-800">Site Settings</h1>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">Admin User</span>
        </header>

        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Homepage Announcement Bar</h2>
                <p className="text-xs font-semibold text-slate-400 mb-6">
                  Configure visual style, color, and behavior of the main announcement bar.
                </p>

                {loading ? (
                  <div className="space-y-4">
                    <div className="h-4 skeleton w-1/4 rounded" />
                    <div className="h-10 skeleton w-full rounded-xl" />
                    <div className="h-4 skeleton w-1/4 rounded" />
                    <div className="h-10 skeleton w-full rounded-xl" />
                    <div className="h-10 skeleton w-28 rounded-xl" />
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-6">
                    {/* Announcement Text */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="announcement" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Announcement Message
                      </label>
                      <input
                        id="announcement"
                        type="text"
                        required
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        placeholder="Enter announcement text..."
                        className="w-full px-4 py-3 text-sm bg-slate-50/50 rounded-xl outline-none border border-slate-200 focus:border-emerald-500/50 transition-all font-semibold"
                      />
                    </div>

                    {/* Background Color selector */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Background Color
                      </label>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Custom Color Picker */}
                        <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-2 bg-slate-50/50 shrink-0">
                          <input
                            type="color"
                            value={announcementBg}
                            onChange={(e) => setAnnouncementBg(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                            title="Choose custom color"
                          />
                          <span className="text-xs font-mono font-bold uppercase select-all text-slate-600">
                            {announcementBg}
                          </span>
                        </div>

                        {/* Presets */}
                        <div className="flex flex-wrap gap-2">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.value}
                              type="button"
                              onClick={() => setAnnouncementBg(preset.value)}
                              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                                announcementBg === preset.value
                                  ? "border-emerald-600 bg-emerald-50/20 text-emerald-650 text-emerald-600"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              <span
                                className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle border border-slate-300"
                                style={{ backgroundColor: preset.value }}
                              />
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Display Style */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="announcement_style" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Display Behavior
                      </label>
                      <select
                        id="announcement_style"
                        value={announcementStyle}
                        onChange={(e) => setAnnouncementStyle(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-slate-50/50 rounded-xl outline-none border border-slate-200 focus:border-emerald-500/50 transition-all font-semibold"
                      >
                        <option value="static">Static (Centered Text)</option>
                        <option value="scrolling">Scrolling (Continuous Marquee)</option>
                      </select>
                    </div>

                    {/* Status Message */}
                    {status.type && (
                      <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs font-bold ${
                        status.type === "success" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {status.type === "success" ? (
                          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        )}
                        <span>{status.message}</span>
                      </div>
                    )}

                    {/* Action button */}
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/10 hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving Changes..." : "Save Configuration"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h3 className="text-base font-bold text-slate-800 mb-1">Live Visual Preview</h3>
                <p className="text-[11px] font-semibold text-slate-400 mb-5">
                  See how the announcement looks in real time.
                </p>

                <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 p-4">
                  {/* Mock Navbar wrapper */}
                  <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
                    {/* The Preview Bar */}
                    <div
                      className="text-white text-[10px] py-1.5 px-3 text-center font-bold tracking-wider relative overflow-hidden flex items-center justify-center h-8 transition-colors duration-300"
                      style={{ backgroundColor: announcementBg }}
                    >
                      {announcementStyle === "scrolling" ? (
                        <div className="whitespace-nowrap inline-block animate-marquee select-none" style={{ animationDuration: "12s" }}>
                          {announcement || "🎉 Add announcement message..."}
                        </div>
                      ) : (
                        <span className="truncate">{announcement || "🎉 Add announcement message..."}</span>
                      )}
                    </div>

                    {/* Mock Header Menu */}
                    <div className="p-3 flex justify-between items-center opacity-40 select-none">
                      <div className="w-16 h-4 bg-slate-200 rounded" />
                      <div className="flex gap-2">
                        <div className="w-8 h-3 bg-slate-200 rounded" />
                        <div className="w-8 h-3 bg-slate-200 rounded" />
                        <div className="w-8 h-3 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-[10px] text-slate-400 font-bold leading-relaxed space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-500">Preview details:</p>
                  <p>• Display: <span className="uppercase text-slate-600 font-extrabold">{announcementStyle}</span></p>
                  <p>• Theme: <span className="uppercase text-slate-600 font-extrabold">{announcementBg}</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {/* Styles for Preview marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </>
  );
}
