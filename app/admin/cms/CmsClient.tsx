"use client";

import { useState } from "react";

import { ArrowUp, ArrowDown, Trash2, Eye, Save, Globe, ChevronDown } from "lucide-react";

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
  
  const [sections, setSections] = useState<Section[]>(initialData.length > 0 ? initialData : mockSections);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId);

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
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Hero Section</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Product Collection</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Category Grid</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Offer Banner</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Brand Carousel</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Testimonials</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Blog Grid</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">FAQ Section</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50">Rich Content Block</button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sections.map((section) => (
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
                <button className="p-1 hover:text-emerald-600 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                  <ArrowUp size={16} />
                </button>
                <button className="p-1 hover:text-emerald-600 rounded transition-colors" onClick={(e) => e.stopPropagation()}>
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
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
              <Save size={16} />
              Save Draft
            </button>
            <button className="px-4 py-2 text-sm font-medium text-emerald-700 bg-white border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors">
              Set as Homepage
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors">
              <Globe size={16} />
              Publish Live
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          {!activeSection ? (
            <div className="text-center text-slate-400 flex flex-col items-center">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Internal Title / Name</label>
                  <input 
                    type="text" 
                    value={activeSection.title}
                    onChange={(e) => {
                      const newSections = sections.map(s => s.id === activeSection.id ? { ...s, title: e.target.value } : s);
                      setSections(newSections);
                    }}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
                  <input 
                    type="text" 
                    defaultValue={activeSection.subtitle || ""}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  />
                </div>
                
                {activeSection.type === "HERO" && (
                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-800">Banner Slides</h4>
                      <button className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium hover:bg-emerald-100">
                        + Add Slide
                      </button>
                    </div>
                    {activeSection.slides?.map((slide, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 mb-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-slate-700">Slide {idx + 1}</span>
                          <button className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14}/></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Heading</label>
                            <input type="text" value={slide.heading} className="w-full border border-slate-300 rounded p-2 text-sm" readOnly />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Subheading</label>
                            <input type="text" value={slide.subheading} className="w-full border border-slate-300 rounded p-2 text-sm" readOnly />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Button Label</label>
                            <input type="text" value={slide.buttonLabel} className="w-full border border-slate-300 rounded p-2 text-sm" readOnly />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Button Link</label>
                            <input type="text" value={slide.link} className="w-full border border-slate-300 rounded p-2 text-sm" readOnly />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Desktop Image URL</label>
                            <input type="text" value={slide.desktopImage} className="w-full border border-slate-300 rounded p-2 text-sm" readOnly />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Image URL</label>
                            <input type="text" value={slide.mobileImage} className="w-full border border-slate-300 rounded p-2 text-sm" readOnly />
                          </div>
                        </div>
                      </div>
                    ))}
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
