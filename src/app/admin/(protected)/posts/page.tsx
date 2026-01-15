"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, FileText, Calendar, MoreHorizontal } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";

type Post = {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  categories?: { name: string }[];
  author?: { name: string };
  created_at: string;
  published_at?: string;
  views_count?: number;
};

export default function AdminPostsPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts?per_page=50");
      if (!res.ok) {
        setItems([]);
        return;
      }
      const json = await res.json().catch(() => null);
      setItems(json?.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete() {
    if (!selectedPost) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${selectedPost.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setSelectedPost(null);
        load();
      }
    } finally {
      setDeleting(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="success" dot>Publié</Badge>;
      case "draft":
        return <Badge variant="warning" dot>Brouillon</Badge>;
      case "scheduled":
        return <Badge variant="info" dot>Programmé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "title" as keyof Post,
      header: "Titre",
      sortable: true,
      render: (item: Post) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900 dark:text-white truncate max-w-xs">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">/{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "categories" as keyof Post,
      header: "Catégories",
      render: (item: Post) => (
        <div className="flex flex-wrap gap-1">
          {item.categories?.length 
            ? item.categories.map((c, i) => <Badge key={i} variant="primary" size="sm">{c.name}</Badge>) 
            : <span className="text-slate-500">-</span>}
        </div>
      ),
    },
    {
      key: "status" as keyof Post,
      header: "Statut",
      sortable: true,
      render: (item: Post) => getStatusBadge(item.status),
    },
    {
      key: "created_at" as keyof Post,
      header: "Date",
      sortable: true,
      render: (item: Post) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
          <Calendar className="w-4 h-4" />
          {new Date(item.created_at).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      key: "views_count" as keyof Post,
      header: "Vues",
      sortable: true,
      render: (item: Post) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Eye className="w-4 h-4" />
          {item.views_count ?? 0}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Articles</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez vos articles et actualités</p>
        </div>
        <Link href="/admin/posts/create">
          <Button icon={<Plus className="w-4 h-4" />}>Nouvel article</Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total articles</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{items.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Publiés</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {items.filter((i) => i.status === "published").length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Brouillons</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {items.filter((i) => i.status === "draft").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={items}
        keyField="id"
        loading={loading}
        emptyMessage="Aucun article trouvé"
        searchPlaceholder="Rechercher un article..."
        actions={(item) => (
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/posts/${item.id}/edit`}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSelectedPost(item);
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

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedPost?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
