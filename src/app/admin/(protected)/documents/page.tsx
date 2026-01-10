"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Download,
  FileText,
  File,
  FileSpreadsheet,
  FileImage,
  Calendar,
  HardDrive,
  Grid,
  List,
} from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";

type Document = {
  id: number;
  title: string;
  slug: string;
  file_type: string;
  file_size: number;
  downloads_count: number;
  category?: { name: string };
  created_at: string;
};

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/documents?per_page=50");
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete() {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/documents/${selectedDoc.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setSelectedDoc(null);
        load();
      }
    } finally {
      setDeleting(false);
    }
  }

  const getFileIcon = (type: string | undefined | null) => {
    if (!type) return <File className="w-5 h-5 text-slate-400" />;
    
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("sheet") || type.includes("excel"))
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    if (type.includes("image")) return <FileImage className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const columns = [
    {
      key: "title" as keyof Document,
      header: "Document",
      sortable: true,
      render: (item: Document) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            {getFileIcon(item.file_type)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 dark:text-white truncate max-w-xs">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">{item.file_type}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category" as keyof Document,
      header: "Catégorie",
      render: (item: Document) => (
        <Badge variant="primary">{item.category?.name ?? "Non classé"}</Badge>
      ),
    },
    {
      key: "file_size" as keyof Document,
      header: "Taille",
      sortable: true,
      render: (item: Document) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <HardDrive className="w-4 h-4" />
          {formatFileSize(item.file_size)}
        </div>
      ),
    },
    {
      key: "downloads_count" as keyof Document,
      header: "Téléchargements",
      sortable: true,
      render: (item: Document) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Download className="w-4 h-4" />
          <a
            href={`/documents/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {item.downloads_count}
          </a>
        </div>
      ),
    },
    {
      key: "created_at" as keyof Document,
      header: "Date",
      sortable: true,
      render: (item: Document) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
          <Calendar className="w-4 h-4" />
          {new Date(item.created_at).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez vos documents et fichiers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "table" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
          <Link href="/admin/documents/create">
            <Button icon={<Plus className="w-4 h-4" />}>Ajouter</Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total documents</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{items.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Téléchargements</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {items.reduce((acc, item) => acc + (item.downloads_count || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Taille totale</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatFileSize(items.reduce((acc, item) => acc + (item.file_size || 0), 0))}
          </p>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <Table
          columns={columns}
          data={items}
          keyField="id"
          loading={loading}
          emptyMessage="Aucun document trouvé"
          searchPlaceholder="Rechercher un document..."
          actions={(item) => (
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/documents/${item.id}/edit`}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Modifier"
              >
                <Pencil className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setSelectedDoc(item);
                  setDeleteModalOpen(true);
                }}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} hover padding="md" className="group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
                  {getFileIcon(item.file_type)}
                </div>
                <p className="font-medium text-slate-900 dark:text-white truncate w-full">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatFileSize(item.file_size)} • {item.downloads_count} téléchargements
                </p>
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoc(item);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le document"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedDoc?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
