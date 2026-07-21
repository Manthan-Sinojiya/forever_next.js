"use client";

import { useState, useEffect } from "react";
import { Save, Plus, X, Loader2, LayoutPanelLeft } from "lucide-react";

export default function AdminNavigationBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Navigation State
  const [navState, setNavState] = useState<any>({
    showHomeButton: true,
    showCategoryDropdown: true,
    categoryMenuLabel: "Category",
    dropdownSubItems: { ink: true, toner: true },
    headerItems: [],
    footerColumns: []
  });

  const fetchNavigation = async () => {
    try {
      const response = await fetch("/api/settings?key=navigation_menus");
      const data = await response.json();
      if (data.success && data.data?.value) {
        setNavState(JSON.parse(data.data.value));
      }
    } catch (error) {
      console.error("Failed to fetch navigation settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "navigation_menus", value: JSON.stringify(navState) }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Navigation Menus saved successfully!");
      } else {
        alert("Failed to save: " + data.error);
      }
    } catch (error) {
      console.error("Error saving navigation:", error);
    } finally {
      setSaving(false);
    }
  };

  const addHeaderItem = () => {
    setNavState({
      ...navState,
      headerItems: [
        ...navState.headerItems,
        {
          id: Date.now().toString(),
          title: "New Item",
          targetUrl: "",
          isMegaMenu: false,
          megaMenuColumns: [],
          promoBanner: { heading: "", link: "", image: "" }
        }
      ]
    });
  };

  const removeHeaderItem = (id: string) => {
    setNavState({
      ...navState,
      headerItems: navState.headerItems.filter((i: any) => i.id !== id)
    });
  };

  const updateHeaderItem = (id: string, field: string, value: any) => {
    setNavState({
      ...navState,
      headerItems: navState.headerItems.map((i: any) => i.id === id ? { ...i, [field]: value } : i)
    });
  };

  const addFooterColumn = () => {
    setNavState({
      ...navState,
      footerColumns: [
        ...navState.footerColumns,
        {
          id: Date.now().toString(),
          title: "New Column",
          links: []
        }
      ]
    });
  };

  return (
    <main className="flex-1 overflow-auto flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 lg:px-8 justify-between sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <LayoutPanelLeft className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold font-heading text-slate-800">Navigation Menus Builder</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Menus & Navigation</>}
          </button>
        </header>

        <div className="p-6 lg:p-8 flex-1 max-w-5xl mx-auto w-full space-y-8 pb-20">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-6">Customize the header navigation menu (mega menus, dynamic brand/category listings) and the multi-column footer navigation links.</p>

              {/* Default Items Configuration */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
                  <div className="w-6 h-6 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-500">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-800">Default Items Configuration</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6">Configure visibility and labels for the default Home button and Category dropdown menu.</p>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={navState.showHomeButton} 
                        onChange={(e) => setNavState({...navState, showHomeButton: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-500" 
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-700">Show Home Button</span>
                        <span className="block text-xs text-slate-500">Display Home icon in sub-navbar</span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={navState.showCategoryDropdown} 
                        onChange={(e) => setNavState({...navState, showCategoryDropdown: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-500" 
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-700">Show Category Dropdown</span>
                        <span className="block text-xs text-slate-500">Display Hamburger Category menu</span>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Category Menu Label</label>
                      <input
                        type="text"
                        value={navState.categoryMenuLabel}
                        onChange={(e) => setNavState({...navState, categoryMenuLabel: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Dropdown Sub-Items</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={navState.dropdownSubItems.medicine}
                            onChange={(e) => setNavState({...navState, dropdownSubItems: {...navState.dropdownSubItems, medicine: e.target.checked}})}
                            className="w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-500" 
                          />
                          <span className="text-sm font-medium text-slate-700">Medicine</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={navState.dropdownSubItems.equipment}
                            onChange={(e) => setNavState({...navState, dropdownSubItems: {...navState.dropdownSubItems, equipment: e.target.checked}})}
                            className="w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-500" 
                          />
                          <span className="text-sm font-medium text-slate-700">Equipment</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Navigation Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-px bg-emerald-200"></div>
                    <div className="w-5 h-px bg-emerald-200 -ml-5 mt-1.5"></div>
                    <div className="w-5 h-px bg-emerald-200 -ml-5 -mt-1.5"></div>
                    <h2 className="text-base font-bold text-slate-800 ml-2">Header Navigation Items</h2>
                  </div>
                  <button onClick={addHeaderItem} className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Navbar Item
                  </button>
                </div>

                {navState.headerItems.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-10 text-center">
                    <p className="text-sm text-slate-400">No custom navigation links. The navbar will display fallback default categories.</p>
                  </div>
                ) : (
                  navState.headerItems.map((item: any) => (
                    <div key={item.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 relative">
                      <button onClick={() => removeHeaderItem(item.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">Item Title (Label)</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateHeaderItem(item.id, "title", e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5">Target URL / Redirect URL</label>
                          <input
                            type="text"
                            value={item.targetUrl}
                            onChange={(e) => updateHeaderItem(item.id, "targetUrl", e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none text-sm font-medium"
                            placeholder="e.g. /about, /products?category=ayurvedic"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer mb-6">
                        <input 
                          type="checkbox" 
                          checked={item.isMegaMenu}
                          onChange={(e) => updateHeaderItem(item.id, "isMegaMenu", e.target.checked)}
                          className="w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-500" 
                        />
                        <span className="text-sm font-bold text-slate-700">Enable Dropdown Mega Menu</span>
                      </label>

                      {item.isMegaMenu && (
                        <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-5">
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1.5">Mega Menu Content Style</label>
                              <select className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 outline-none text-sm font-medium text-slate-700">
                                <option>Custom Columns Layout</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1.5">Menu Drop Direction</label>
                              <select className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 outline-none text-sm font-medium text-slate-700">
                                <option>Drop Down (Default)</option>
                              </select>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xs font-bold text-slate-700">Mega Menu Columns</h3>
                              <button className="text-xs font-bold text-indigo-600 flex items-center gap-1"><Plus className="w-3 h-3"/> Add Column</button>
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-4">
                            <h3 className="text-xs font-bold text-slate-700 mb-4">Right-Side Promotional Banner (Optional)</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-1">Banner Heading</label>
                                  <input type="text" className="w-full px-4 py-1.5 rounded-lg border border-slate-200 text-sm" placeholder="e.g. Premium Herbs" />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-400 mb-1">Banner Destination Link</label>
                                  <input type="text" className="w-full px-4 py-1.5 rounded-lg border border-slate-200 text-sm" placeholder="e.g. /products?category=ayurvedic" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Banner Image file</label>
                                <div className="flex items-center gap-3">
                                  <button className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">Browse...</button>
                                  <span className="text-xs text-slate-400">No file selected.</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer Columns */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-px bg-emerald-200"></div>
                    <div className="w-5 h-px bg-emerald-200 -ml-5 mt-1.5"></div>
                    <div className="w-5 h-px bg-emerald-200 -ml-5 -mt-1.5"></div>
                    <h2 className="text-base font-bold text-slate-800 ml-2">Footer Columns</h2>
                  </div>
                  <button onClick={addFooterColumn} className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Footer Column
                  </button>
                </div>

                {navState.footerColumns.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-10 text-center">
                    <p className="text-sm text-slate-400">No custom footer columns configured. The footer will render the default corporate columns.</p>
                  </div>
                ) : (
                  navState.footerColumns.map((col: any) => (
                    <div key={col.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 relative">
                       {/* Simplified for demo purposes to match screenshots */}
                       <h3 className="font-bold text-slate-800">{col.title}</h3>
                    </div>
                  ))
                )}
              </div>
              
            </>
          )}
        </div>
      </main>
    
  );
}
