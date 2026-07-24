"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bulkSaveCmsSections } from "@/actions/admin/cms";
import { ArrowUp, ArrowDown, Trash2, Eye, Save, Globe, ChevronDown } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

type SectionType = "CATEGORYGRID" | "HERO" | "PRODUCTGRID" | "RICHCONTENT" | "OFFERBANNER" | "BLOGGRID";

interface Section {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  description?: string;
  isEnabled: boolean;
  limit?: number;
  cardStyle?: string;
  buttonText?: string;
  buttonLink?: string;
  slides?: {
    heading: string;
    subheading: string;
    desktopImage: string;
    mobileImage: string;
    altText: string;
    link: string;
    buttonLabel: string;
  }[];
}

const mockSections: Section[] = [
  { id: "1", type: "CATEGORYGRID", title: "FHCL Categories", limit: 4, cardStyle: "Classic Bordered", isEnabled: true },
  { id: "2", type: "HERO", title: "Main Banner", isEnabled: true, slides: [{ heading: "Recharge Refresh Restart", subheading: "Best health products", desktopImage: "", mobileImage: "", altText: "", link: "/products", buttonLabel: "Shop Now" }] },
  { id: "3", type: "PRODUCTGRID", title: "Best Sellers", isEnabled: true },
  { id: "4", type: "PRODUCTGRID", title: "Sale", isEnabled: true },
  { id: "5", type: "HERO", title: "Secondary Banner", isEnabled: true, slides: [] },
  { id: "6", type: "RICHCONTENT", title: "About Us Snippet", isEnabled: true },
  { id: "7", type: "OFFERBANNER", title: "Promo Strip", isEnabled: true },
  { id: "8", type: "BLOGGRID", title: "Latest Articles", isEnabled: true },
];

export default function CmsClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  // Ensure sections have an id for the frontend
  const initialSections = initialData.length > 0 
    ? initialData.map((s, i) => ({ ...s, id: s._id || String(i) }))
    : mockSections;

  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  const handleSave = async () => {
    setIsSaving(true);
    await bulkSaveCmsSections(sections);
    setIsSaving(false);
    router.refresh();
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* Left Sidebar - Page Structure */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white relative">
          <h2 className="text-lg font-bold text-slate-800">Page Structure</h2>
          <div className="relative">
            <button 
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              + Add Section <ChevronDown size={14} />
            </button>
            
            {showAddMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)}></div>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 text-sm text-slate-700">
                  <div className="px-3 py-1.5 bg-slate-100 text-slate-500 font-medium text-xs">+ Add Section</div>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "HERO", title: "New Hero Section", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Hero Section</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "PRODUCTGRID", title: "New Product Grid", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Product Collection</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "CATEGORYGRID", title: "New Category Grid", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Category Grid</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "OFFERBANNER", title: "New Offer Banner", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Offer Banner</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "TRUSTBADGES", title: "New Trust Badges", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Trust Badges</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "TESTIMONIALS", title: "New Testimonials", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Testimonials</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "BLOGGRID", title: "New Blog Grid", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Blog Grid</button>
                  <button onClick={() => { setSections([...sections, { id: Date.now().toString(), type: "RICHCONTENT", title: "New Rich Content Block", isEnabled: true }]); setShowAddMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50">Rich Content Block</button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              onClick={() => setActiveSectionId(section.id)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                activeSectionId === section.id 
                  ? "bg-emerald-50 border-emerald-200" 
                  : "bg-white border-slate-200 hover:border-emerald-200 hover:shadow-sm"
              }`}
            >
              <div>
                <div className={`text-xs font-bold mb-0.5 ${activeSectionId === section.id ? "text-emerald-700" : "text-emerald-600"}`}>
                  {section.type}
                </div>
                <div className="text-sm font-medium text-slate-800 truncate max-w-[160px]">
                  {section.title}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button className="p-1 hover:text-emerald-600 rounded transition-colors" onClick={(e) => {
                  e.stopPropagation();
                  if (index > 0) {
                    const newSections = [...sections];
                    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
                    setSections(newSections);
                  }
                }}>
                  <ArrowUp size={16} />
                </button>
                <button className="p-1 hover:text-emerald-600 rounded transition-colors" onClick={(e) => {
                  e.stopPropagation();
                  if (index < sections.length - 1) {
                    const newSections = [...sections];
                    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
                    setSections(newSections);
                  }
                }}>
                  <ArrowDown size={16} />
                </button>
                <button className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" onClick={(e) => {
                  e.stopPropagation();
                  setSections(sections.filter(s => s.id !== section.id));
                  if(activeSectionId === section.id) setActiveSectionId(null);
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane - Editor/Preview */}
      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">Forever Healthcare Homepage</h2>
            <span className="px-2 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded">LIVE</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Page Layout"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center">
          {!activeSection ? (
            <div className="text-center text-slate-400 flex flex-col items-center mt-20">
              <Eye size={48} className="mb-4 text-slate-300 opacity-50" />
              <p className="text-lg">Select a section from the left panel to configure its contents.</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                {activeSection.type === "CATEGORYGRID" ? "CategoryGrid Configuration" : `${activeSection.type} Configuration`}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Enable Section</label>
                    <p className="text-xs text-slate-500">Show this section on the storefront.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={activeSection.isEnabled}
                      onChange={(e) => {
                        const newSections = sections.map(s => s.id === activeSection.id ? { ...s, isEnabled: e.target.checked } : s);
                        setSections(newSections);
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Heading / Title</label>
                  <input 
                    type="text" 
                    value={activeSection.title}
                    onChange={(e) => {
                      const newSections = sections.map(s => s.id === activeSection.id ? { ...s, title: e.target.value } : s);
                      setSections(newSections);
                    }}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  />
                  <p className="text-xs text-slate-500 mt-1">This text will be displayed on the frontend.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Top Tags (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={activeSection.subtitle || ""}
                    onChange={(e) => {
                      const newSections = sections.map(s => s.id === activeSection.id ? { ...s, subtitle: e.target.value } : s);
                      setSections(newSections);
                    }}
                    placeholder="e.g. Best Sellers, Trending, Fresh"
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  />
                  <p className="text-xs text-slate-500 mt-1">These appear as small badges above the heading.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {activeSection.type === "OFFERBANNER" ? "Timer End Date (e.g. 2026-12-31T23:59:59)" : "Bottom Subtitle / Description"}
                  </label>
                  <input 
                    type={activeSection.type === "OFFERBANNER" ? "datetime-local" : "text"} 
                    value={activeSection.description || ""}
                    onChange={(e) => {
                      const newSections = sections.map(s => s.id === activeSection.id ? { ...s, description: e.target.value } : s);
                      setSections(newSections);
                    }}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  />
                  {activeSection.type === "OFFERBANNER" && <p className="text-xs text-slate-500 mt-1">Leave empty to hide the countdown timer.</p>}
                </div>
                
                {(activeSection.type === "PRODUCTGRID" || activeSection.type === "CATEGORYGRID" || activeSection.type === "BLOGGRID") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Item Limit</label>
                      <input 
                        type="number" 
                        value={activeSection.limit || 4} 
                        onChange={(e) => {
                          const newSections = sections.map(s => s.id === activeSection.id ? { ...s, limit: parseInt(e.target.value) || 4 } : s);
                          setSections(newSections);
                        }}
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                      />
                      <p className="text-xs text-slate-500 mt-1">Number of items to display in the grid.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Style</label>
                      <select
                        value={activeSection.cardStyle || "style1"}
                        onChange={(e) => {
                          const newSections = sections.map(s => s.id === activeSection.id ? { ...s, cardStyle: e.target.value } : s);
                          setSections(newSections);
                        }}
                        className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white"
                      >
                        <option value="style1">Style 1</option>
                        <option value="style2">Style 2</option>
                        <option value="style3">Style 3</option>
                        <option value="Classic Bordered">Classic Bordered</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">Choose UI card design for this section.</p>
                    </div>
                  </div>
                )}
                
                {(activeSection.type === "HERO" || activeSection.type === "TRUSTBADGES") && (
                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-800">{activeSection.type === "TRUSTBADGES" ? "Trust Cards / Badges" : "Banner Slides"}</h4>
                      <button 
                        onClick={() => {
                          const newSections = sections.map(s => {
                            if (s.id !== activeSection.id) return s;
                            const newSlides = [...(s.slides || []), {
                              heading: "New Label", subheading: "", desktopImage: "", mobileImage: "", altText: "", link: "", buttonLabel: "Action"
                            }];
                            return { ...s, slides: newSlides };
                          });
                          setSections(newSections);
                        }}
                        className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium hover:bg-emerald-100"
                      >
                        + Add Slide
                      </button>
                    </div>
                    {activeSection.slides?.map((slide, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-slate-700">Slide {idx + 1}</span>
                          <button 
                            onClick={() => {
                              const newSections = sections.map(s => {
                                if (s.id !== activeSection.id) return s;
                                const newSlides = [...(s.slides || [])];
                                newSlides.splice(idx, 1);
                                return { ...s, slides: newSlides };
                              });
                              setSections(newSections);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={14}/>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Heading</label>
                            <input 
                              type="text" 
                              value={slide.heading || ""} 
                              onChange={(e) => {
                                const newSections = sections.map(s => {
                                  if (s.id !== activeSection.id) return s;
                                  const newSlides = [...(s.slides || [])];
                                  newSlides[idx] = { ...newSlides[idx], heading: e.target.value };
                                  return { ...s, slides: newSlides };
                                });
                                setSections(newSections);
                              }}
                              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Subheading</label>
                            <input 
                              type="text" 
                              value={slide.subheading || ""} 
                              onChange={(e) => {
                                const newSections = sections.map(s => {
                                  if (s.id !== activeSection.id) return s;
                                  const newSlides = [...(s.slides || [])];
                                  newSlides[idx] = { ...newSlides[idx], subheading: e.target.value };
                                  return { ...s, slides: newSlides };
                                });
                                setSections(newSections);
                              }}
                              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                            />
                          </div>
                          {activeSection.type !== "TRUSTBADGES" && (
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Button Label</label>
                              <input 
                                type="text" 
                                value={slide.buttonLabel || ""} 
                                onChange={(e) => {
                                  const newSections = sections.map(s => {
                                    if (s.id !== activeSection.id) return s;
                                    const newSlides = [...(s.slides || [])];
                                    newSlides[idx] = { ...newSlides[idx], buttonLabel: e.target.value };
                                    return { ...s, slides: newSlides };
                                  });
                                  setSections(newSections);
                                }}
                                className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                              />
                            </div>
                          )}
                          {activeSection.type !== "TRUSTBADGES" && (
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Button Link</label>
                              <input 
                                type="text" 
                                value={slide.link || ""} 
                                onChange={(e) => {
                                  const newSections = sections.map(s => {
                                    if (s.id !== activeSection.id) return s;
                                    const newSlides = [...(s.slides || [])];
                                    newSlides[idx] = { ...newSlides[idx], link: e.target.value };
                                    return { ...s, slides: newSlides };
                                  });
                                  setSections(newSections);
                                }}
                                className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                              />
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className={activeSection.type === "TRUSTBADGES" ? "col-span-2" : ""}>
                            <ImageUpload 
                              label="Desktop Image URL"
                              value={slide.desktopImage || ""} 
                              onChange={(url) => {
                                const newSections = sections.map(s => {
                                  if (s.id !== activeSection.id) return s;
                                  const newSlides = [...(s.slides || [])];
                                  newSlides[idx] = { ...newSlides[idx], desktopImage: url };
                                  return { ...s, slides: newSlides };
                                });
                                setSections(newSections);
                              }}
                            />
                          </div>
                          {activeSection.type !== "TRUSTBADGES" && (
                            <div>
                              <ImageUpload 
                                label="Mobile Image URL" 
                                value={slide.mobileImage || ""} 
                                onChange={(url) => {
                                  const newSections = sections.map(s => {
                                    if (s.id !== activeSection.id) return s;
                                    const newSlides = [...(s.slides || [])];
                                    newSlides[idx] = { ...newSlides[idx], mobileImage: url };
                                    return { ...s, slides: newSlides };
                                  });
                                  setSections(newSections);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection.type === "RICHCONTENT" && (
                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-4">Content Image</h4>
                    <ImageUpload 
                      label="Rich Content Image"
                      value={(activeSection as any).content?.image || ""} 
                      onChange={(url) => {
                        const newSections = sections.map(s => {
                          if (s.id !== activeSection.id) return s;
                          return { ...s, content: { ...((s as any).content || {}), image: url } };
                        });
                        setSections(newSections);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
