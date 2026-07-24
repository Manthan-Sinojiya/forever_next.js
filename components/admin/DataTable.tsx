"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Plus, Edit, Trash2, Filter, MoreHorizontal, ArrowUpDown, Download } from "lucide-react";
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
  const itemsPerPage = 10;

  const filteredData = data.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    if (filteredData.length === 0) return;
    
    // Get headers
    const headers = columns.map(c => c.label).join(",");
    
    // Get rows
    const rows = filteredData.map(item => {
      return columns.map(col => {
        let val = (item as any)[col.key];
        if (typeof val === "object" && val !== null) {
          val = JSON.stringify(val);
        } else if (val === undefined || val === null) {
          val = "";
        } else {
          val = String(val);
        }
        // escape quotes and wrap in quotes
        return `"${val.replace(/"/g, '""')}"`;
      }).join(",");
    });
    
    const csvContent = [headers, ...rows].join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-200/60 overflow-hidden flex flex-col">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{filteredData.length} total items</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          
          <div 
            className={`
              relative flex items-center w-full sm:w-72 bg-slate-50/50 border rounded-xl transition-all duration-200
              ${isFocused ? 'border-indigo-300 ring-2 ring-indigo-100 bg-white' : 'border-slate-200 hover:border-slate-300'}
            `}
          >
            <Search className={`absolute left-3 w-4 h-4 transition-colors ${isFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
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
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors tooltip-trigger" title="Filter">
              <Filter className="w-4 h-4" />
            </button>
            <button onClick={handleExport} className="flex items-center justify-center p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors tooltip-trigger" title="Export CSV">
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
              <button onClick={onAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
              </button>
            )}
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
