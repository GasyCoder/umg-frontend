"use client";

import { clsx } from "clsx";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "./Input";

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
}

export function Table<T>({
  columns,
  data,
  keyField,
  loading = false,
  searchable = true,
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucune donnée",
  pageSize = 10,
  actions,
}: TableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Filter data
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      Object.values(item as Record<string, unknown>).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = String((a as Record<string, unknown>)[sortKey] ?? "");
      const bVal = String((b as Record<string, unknown>)[sortKey] ?? "");
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchable && (
        <div className="max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={clsx(
                      "px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider",
                      col.sortable && "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800",
                      col.className
                    )}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        sortDir === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Chargement...
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr
                    key={String((item as Record<string, unknown>)[keyField as string])}
                    className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={clsx("px-4 py-3 text-sm text-slate-700 dark:text-slate-200", col.className)}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key as string] ?? "")}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedData.length)} sur{" "}
              {sortedData.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} sur {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
