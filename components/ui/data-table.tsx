"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Search, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  createHref?: string
  onAdd?: () => void
  onDelete?: (id: string) => void
  pageCount?: number
  onPaginationChange?: (updater: any) => void
  onGlobalFilterChange?: (updater: any) => void
  onSortingChange?: (updater: any) => void
  pagination?: { pageIndex: number; pageSize: number }
  globalFilter?: string
  sorting?: SortingState
}

export function DataTable<TData extends { _id?: string; id?: string }, TValue>({
  columns,
  data,
  searchKey = "name",
  createHref,
  onAdd,
  onDelete,
  pageCount = -1,
  onPaginationChange,
  onGlobalFilterChange,
  onSortingChange,
  pagination,
  globalFilter,
  sorting,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("")
  const [internalPagination, setInternalPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const isServer = onPaginationChange !== undefined

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting: isServer ? sorting : internalSorting,
      globalFilter: isServer ? globalFilter : internalGlobalFilter,
      pagination: isServer ? pagination : internalPagination,
      columnFilters: internalColumnFilters,
    },
    onSortingChange: isServer ? onSortingChange : setInternalSorting,
    onGlobalFilterChange: isServer ? onGlobalFilterChange : setInternalGlobalFilter,
    onPaginationChange: isServer ? onPaginationChange : setInternalPagination,
    onColumnFiltersChange: setInternalColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServer ? undefined : getSortedRowModel(),
    getFilteredRowModel: isServer ? undefined : getFilteredRowModel(),
    manualPagination: isServer,
    manualSorting: isServer,
    manualFiltering: isServer,
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder={`Search ${searchKey}...`}
            value={(isServer ? globalFilter : internalGlobalFilter) ?? ""}
            onChange={(event) =>
              isServer 
                ? onGlobalFilterChange?.(event.target.value) 
                : setInternalGlobalFilter(event.target.value)
            }
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full text-sm dark:bg-slate-900 dark:border-slate-800"
          />
        </div>
        {createHref ? (
          <Link
            href={createHref}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        ) : onAdd ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Page
          </button>
        ) : null}
      </div>
      <div className="rounded-md border border-gray-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="px-4 py-3 font-medium border-b border-gray-200 dark:border-slate-700">
                        {header.isPlaceholder ? null : (
                          <div 
                            className={cn(
                              "flex items-center gap-2", 
                              header.column.getCanSort() && "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="h-3 w-3 opacity-50" />
                            )}
                          </div>
                        )}
                      </th>
                    )
                  })}
                  {(onDelete || createHref) && (
                    <th className="px-4 py-3 font-medium border-b border-gray-200 dark:border-slate-700 text-right">
                      Actions
                    </th>
                  )}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    {(onDelete || createHref) && (
                      <td className="px-4 py-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          {createHref && (
                            <Link
                              href={`${createHref.replace('/new', '')}/${row.original._id || row.original.id}`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row.original._id || row.original.id as string)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (onDelete || createHref ? 1 : 0)}
                    className="h-24 text-center text-gray-500"
                  >
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getRowCount()
          )}{" "}
          of {table.getRowCount()} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 dark:bg-slate-800"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded-md text-sm disabled:opacity-50 dark:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
