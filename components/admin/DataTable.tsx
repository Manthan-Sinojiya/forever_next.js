"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Plus, Edit, Trash2, Filter, MoreHorizontal, ArrowUpDown, Download, X, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onDelete?: (id: string) => void;
  createHref?: string;
  searchPlaceholder?: string;
  exportFilename?: string;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  title,
  data,
  columns,
  onDelete,
  createHref,
  searchPlaceholder = "Search...",
  exportFilename = "export.csv",
  onAdd,
  onEdit
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;

  // Close filter popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically extract unique statuses/roles/categories from data
  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item: any) => {
      const s = item.status || item.orderStatus || item.paymentStatus || item.role || item.category;
      if (s && typeof s === "string") {
        set.add(s);
      }
    });
    return Array.from(set);
  }, [data]);

  // Combined filtering & sorting
  const filteredData = useMemo(() => {
    let result = data.filter((item: any) => {
      // 1. Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches = Object.values(item).some((val) => {
          if (val === null || val === undefined) return false;
          if (typeof val === "object") return JSON.stringify(val).toLowerCase().includes(term);
          return String(val).toLowerCase().includes(term);
        });
        if (!matches) return false;
      }

      // 2. Status filter
      if (selectedStatus !== "all") {
        const s = item.status || item.orderStatus || item.paymentStatus || item.role || item.category || "";
        if (String(s).toLowerCase() !== selectedStatus.toLowerCase()) return false;
      }

      return true;
    });

    // 3. Sorting
    if (sortKey) {
      result = [...result].sort((a: any, b: any) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (valA === undefined || valA === null) valA = "";
        if (valB === undefined || valB === null) valB = "";

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, selectedStatus, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    if (filteredData.length === 0) {
      setExportMessage("No data to export.");
      setTimeout(() => setExportMessage(null), 2500);
      return;
    }

    // Get headers
    const headers = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");

    // Get rows
    const rows = filteredData.map((item: any) => {
      return columns
        .map((col) => {
          let val = item[col.key];

          // Fallbacks for id/nested properties
          if (val === undefined) {
            if (col.key === "_id" || col.key === "id") val = item._id || item.id;
          }

          if (typeof val === "object" && val !== null) {
            if (val.name) val = val.name;
            else if (val.fullName) val = val.fullName;
            else if (val.title) val = val.title;
            else val = JSON.stringify(val);
          } else if (val === undefined || val === null) {
            val = "";
          } else {
            val = String(val);
          }

          // Strip any HTML tags if string contains code
          val = val.replace(/<[^>]*>?/gm, "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const safeFilename = exportFilename.toLowerCase().endsWith(".csv")
      ? exportFilename
      : `${exportFilename}.csv`;

    link.setAttribute("download", safeFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportMessage(`Exported ${filteredData.length} items to ${safeFilename}`);
    setTimeout(() => setExportMessage(null), 3000);
  };

  const handleSortToggle = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else {
        setSortKey(null);
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSortKey(null);
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const isFiltered = searchTerm !== "" || selectedStatus !== "all" || sortKey !== null;

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60 flex flex-col">
      {/* Toast Banner for CSV export */}
      {exportMessage && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between animate-fade-in">
          <span>{exportMessage}</span>
          <button onClick={() => setExportMessage(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-20 relative">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{filteredData.length} total items</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div
            className={`
              relative flex items-center w-full sm:w-72 bg-slate-50/50 border rounded-xl transition-all duration-200
              ${isFocused ? "border-indigo-300 ring-2 ring-indigo-100 bg-white" : "border-slate-200 hover:border-slate-300"}
            `}
          >
            <Search className={`absolute left-3 w-4 h-4 transition-colors ${isFocused ? "text-indigo-500" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto relative" ref={filterRef}>
            {/* FILTER BUTTON & POPOVER */}
            <button
              type="button"
              onClick={() => setShowFilterPopover(!showFilterPopover)}
              className={`flex items-center justify-center p-2.5 border rounded-xl transition-all relative ${
                isFiltered
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200 font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
              title="Filter & Sort Options"
            >
              <Filter className="w-4 h-4" />
              {isFiltered && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* DOWNLOAD EXPORT BUTTON */}
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              title="Download CSV Export"
            >
              <Download className="w-4 h-4" />
            </button>

            {createHref && (
              <Link
                href={createHref}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
              </Link>
            )}
            {onAdd && (
              <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            )}

            {/* FILTER POPOVER MENU */}
            <AnimatePresence>
              {showFilterPopover && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-slate-200/90 p-5 z-50 text-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Filter className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-none">Filter & Sort</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Customize view results</p>
                      </div>
                    </div>
                    {isFiltered && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 bg-indigo-50/80 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>

                  {/* Status / Category Selection */}
                  {availableStatuses.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Filter Status
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                        <button
                          type="button"
                          onClick={() => { setSelectedStatus("all"); setCurrentPage(1); }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                            selectedStatus === "all"
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          {selectedStatus === "all" && <Check className="w-3 h-3" />}
                          All
                        </button>
                        {availableStatuses.map((st) => {
                          const isSelected = selectedStatus.toLowerCase() === st.toLowerCase();
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => { setSelectedStatus(st); setCurrentPage(1); }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all flex items-center gap-1.5 border ${
                                isSelected
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sort By Column Pills */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Sort By Column
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      <button
                        type="button"
                        onClick={() => setSortKey(null)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                          sortKey === null
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {sortKey === null && <Check className="w-3 h-3" />}
                        Default (Unsorted)
                      </button>
                      {columns.map((col) => {
                        const isSelected = sortKey === col.key;
                        return (
                          <button
                            key={col.key}
                            type="button"
                            onClick={() => setSortKey(col.key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {col.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort Order Direction */}
                  {sortKey && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-600">Sort Direction</span>
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setSortOrder("asc")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            sortOrder === "asc" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Ascending ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortOrder("desc")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            sortOrder === "desc" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Descending ↓
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFilterPopover(false)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-indigo-200 active:scale-[0.98]"
                    >
                      Apply & Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200 uppercase tracking-wider sticky top-0 z-0">
            <tr>
              <th className="px-6 py-3.5 font-medium w-10 text-center">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors" />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3.5 font-semibold group cursor-pointer hover:text-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, i) => {
                  const id = row._id || row.id || String(i);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      key={id} 
                      className="bg-white hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-colors opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100" />
                      </td>
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 text-slate-600 font-medium">
                          {col.render ? col.render(row) : String((row as any)[col.key] || "")}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {createHref && (
                            <Link 
                              href={`${createHref.replace('/new', '')}/${id}`} 
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          )}
                          {onEdit && (
                            <button 
                              onClick={() => onEdit(row)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button 
                              onClick={() => onDelete(id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium text-slate-600">No records found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
        <span className="text-xs font-medium text-slate-500">
          Showing <span className="text-slate-900">{filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="text-slate-900">{filteredData.length}</span> entries
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          
          <div className="flex items-center px-2">
            <span className="text-sm text-slate-600 font-medium">Page {currentPage} of {totalPages}</span>
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent shadow-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
