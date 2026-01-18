"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Archive, FileMinus, FileText, Calendar, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";

type Post = {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft" | "pending" | "archived";
  categories?: { name: string }[];
  author?: { name: string };
  created_at: string;
  published_at?: string;
  is_important?: boolean;
  views_count?: number;
  unique_views_count?: number;
};

type PostStatus = Post["status"];
type StatusFilter = "all" | PostStatus;

export default function AdminPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"archive" | "draft" | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showNewsletterBanner, setShowNewsletterBanner] = useState(true);
  const [counts, setCounts] = useState<Record<StatusFilter, number>>({
    all: 0,
    published: 0,
    draft: 0,
    pending: 0,
    archived: 0,
  });

  const statusParam = searchParams.get("status");
  const statusFilter: StatusFilter =
    statusParam === "published" || statusParam === "draft" || statusParam === "pending" || statusParam === "archived"
      ? statusParam
      : "all";

  function pushStatusFilter(next: StatusFilter) {
    const params = new URLSearchParams();
    if (next !== "all") params.set("status", next);
    router.push(`/admin/posts${params.toString() ? `?${params.toString()}` : ""}`);
  }

  async function loadCounts() {
    const targets: { key: StatusFilter; url: string }[] = [
      { key: "all", url: "/api/admin/posts?per_page=1" },
      { key: "published", url: "/api/admin/posts?per_page=1&status=published" },
      { key: "draft", url: "/api/admin/posts?per_page=1&status=draft" },
      { key: "pending", url: "/api/admin/posts?per_page=1&status=pending" },
      { key: "archived", url: "/api/admin/posts?per_page=1&status=archived" },
    ];

    try {
      const results = await Promise.all(
        targets.map(async (t) => {
          const res = await fetch(t.url);
          if (!res.ok) return [t.key, 0] as const;
          const json = await res.json().catch(() => null);
          const total = Number(json?.meta?.total ?? 0);
          return [t.key, Number.isFinite(total) ? total : 0] as const;
        })
      );

      setCounts((prev) => {
        const next = { ...prev };
        for (const [key, value] of results) next[key] = value;
        return next;
      });
    } catch {
      // ignore (keep previous counts)
    }
  }

  async function load() {
    setLoading(true);
    try {
      const url =
        statusFilter === "all"
          ? "/api/admin/posts?per_page=50"
          : `/api/admin/posts?per_page=50&status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url);
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
  }, [statusFilter]);

  useEffect(() => {
    void loadCounts();
  }, []);

  const newsletterQueuedParam = searchParams.get("newsletterQueued");
  const newsletterCampaignIdParam = searchParams.get("newsletterCampaignId");
  const newsletterQueued = newsletterQueuedParam ? Number(newsletterQueuedParam) : null;
  const newsletterCampaignId = newsletterCampaignIdParam ? Number(newsletterCampaignIdParam) : null;
  const hasNewsletterInfo = Number.isFinite(newsletterQueued as number);

  useEffect(() => {
    if (!hasNewsletterInfo) return;
    setShowNewsletterBanner(true);
    const t = setTimeout(() => {
      // remove query params (so it doesn't show again on refresh)
      pushStatusFilter(statusFilter);
    }, 8000);
    return () => clearTimeout(t);
  }, [hasNewsletterInfo, router, statusFilter]);

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
        void loadCounts();
        load();
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleStatusUpdate() {
    if (!selectedPost || !statusAction) return;
    setUpdatingStatus(true);
    try {
      const endpoint =
        statusAction === "archive"
          ? `/api/admin/posts/${selectedPost.id}/archive`
          : `/api/admin/posts/${selectedPost.id}/draft`;

      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        const nextFilter: StatusFilter = statusAction === "archive" ? "archived" : "draft";
        setStatusModalOpen(false);
        setStatusAction(null);
        setSelectedPost(null);
        void loadCounts();
        if (statusFilter !== nextFilter) {
          pushStatusFilter(nextFilter);
          return;
        }
        load();
      }
    } finally {
      setUpdatingStatus(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="success" dot>Publié</Badge>;
      case "draft":
        return <Badge variant="warning" dot>Brouillon</Badge>;
      case "pending":
        return <Badge variant="info" dot>En attente</Badge>;
      case "archived":
        return <Badge variant="default" dot>Archivé</Badge>;
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
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate max-w-xs">{item.title}</p>
              {item.is_important ? (
                <Badge variant="primary" size="sm">Important</Badge>
              ) : null}
            </div>
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
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({item.unique_views_count ?? 0} uniques)
          </span>
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

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={statusFilter === "all" ? "primary" : "secondary"}
          onClick={() => pushStatusFilter("all")}
        >
          Tous <span className="ml-2 text-xs opacity-90">({counts.all})</span>
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "published" ? "primary" : "secondary"}
          onClick={() => pushStatusFilter("published")}
        >
          Publiés <span className="ml-2 text-xs opacity-90">({counts.published})</span>
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "draft" ? "primary" : "secondary"}
          onClick={() => pushStatusFilter("draft")}
        >
          Brouillons <span className="ml-2 text-xs opacity-90">({counts.draft})</span>
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "pending" ? "primary" : "secondary"}
          onClick={() => pushStatusFilter("pending")}
        >
          En attente <span className="ml-2 text-xs opacity-90">({counts.pending})</span>
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "archived" ? "primary" : "secondary"}
          onClick={() => pushStatusFilter("archived")}
        >
          Archivés <span className="ml-2 text-xs opacity-90">({counts.archived})</span>
        </Button>
      </div>

      {hasNewsletterInfo && showNewsletterBanner ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant={newsletterQueued === 0 ? "warning" : "success"} dot>
                Newsletter
              </Badge>
              <p className="font-semibold text-slate-900 dark:text-white">
                {newsletterQueued === 0 ? "Aucun abonné actif" : "Envoi en cours"}
              </p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {newsletterQueued === 0
                ? "Aucun email n'a été envoyé (0 abonné actif)."
                : `${newsletterQueued} abonné(s) en file d'attente${newsletterCampaignId ? ` (campagne #${newsletterCampaignId})` : ""}.`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/newsletter">
              <Button variant="secondary" size="sm">Newsletter</Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowNewsletterBanner(false);
                pushStatusFilter(statusFilter);
              }}
            >
              Fermer
            </Button>
          </div>
        </div>
      ) : null}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total articles</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{counts.all}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Publiés</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {counts.published}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Brouillons</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {counts.draft}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Archivés</p>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-200 mt-1">
            {counts.archived}
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
            {item.status === "published" ? (
              <button
                onClick={() => {
                  setSelectedPost(item);
                  setStatusAction("archive");
                  setStatusModalOpen(true);
                }}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Archiver"
              >
                <Archive className="w-4 h-4" />
              </button>
            ) : null}
            {item.status !== "draft" ? (
              <button
                onClick={() => {
                  setSelectedPost(item);
                  setStatusAction("draft");
                  setStatusModalOpen(true);
                }}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                title="Mettre en brouillon"
              >
                <FileMinus className="w-4 h-4" />
              </button>
            ) : null}
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

      {/* Status Confirmation */}
      <ConfirmModal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setStatusAction(null);
        }}
        onConfirm={handleStatusUpdate}
        title={statusAction === "archive" ? "Archiver l'article" : "Mettre en brouillon"}
        message={
          statusAction === "archive"
            ? `Êtes-vous sûr de vouloir archiver "${selectedPost?.title}" ?`
            : `Êtes-vous sûr de vouloir mettre "${selectedPost?.title}" en brouillon ? Il ne sera plus visible publiquement.`
        }
        confirmText={statusAction === "archive" ? "Archiver" : "Mettre en brouillon"}
        loading={updatingStatus}
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
