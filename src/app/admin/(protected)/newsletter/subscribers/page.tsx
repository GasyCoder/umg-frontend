"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Mail,
  Calendar,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";

type Subscriber = {
  id: number;
  email: string;
  name?: string;
  status: "active" | "unsubscribed" | "pending" | "bounced";
  subscribed_at: string;
  unsubscribed_at?: string;
};

export default function AdminSubscribersPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/newsletter/subscribers?per_page=100");
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setCreateModalOpen(false);
        setFormData({ email: "", name: "" });
        load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedSubscriber) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${selectedSubscriber.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setSelectedSubscriber(null);
        load();
      }
    } finally {
      setSaving(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success" dot>Actif</Badge>;
      case "unsubscribed":
        return <Badge variant="warning" dot>Désabonné</Badge>;
      case "pending":
        return <Badge variant="info" dot>En attente</Badge>;
      case "bounced":
        return <Badge variant="error" dot>Erreur</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "email" as keyof Subscriber,
      header: "Email",
      sortable: true,
      render: (item: Subscriber) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-semibold">
            {item.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{item.email}</p>
            {item.name && <p className="text-xs text-slate-500 dark:text-slate-400">{item.name}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof Subscriber,
      header: "Statut",
      sortable: true,
      render: (item: Subscriber) => getStatusBadge(item.status),
    },
    {
      key: "subscribed_at" as keyof Subscriber,
      header: "Date d'inscription",
      sortable: true,
      render: (item: Subscriber) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
          <Calendar className="w-4 h-4" />
          {new Date(item.subscribed_at).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
  ];

  const activeCount = items.filter((i) => i.status === "active").length;
  const unsubscribedCount = items.filter((i) => i.status === "unsubscribed").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Abonnés Newsletter</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez votre liste d'abonnés</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Exporter CSV
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCreateModalOpen(true)}>
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total abonnés"
          value={items.length}
          icon={<Mail className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Actifs"
          value={activeCount}
          icon={<CheckCircle className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Désabonnés"
          value={unsubscribedCount}
          icon={<XCircle className="w-6 h-6" />}
          color="amber"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={items}
        keyField="id"
        loading={loading}
        emptyMessage="Aucun abonné trouvé"
        searchPlaceholder="Rechercher par email..."
        actions={(item) => (
          <button
            onClick={() => {
              setSelectedSubscriber(item);
              setDeleteModalOpen(true);
            }}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      />

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Ajouter un abonné"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Adresse email"
            type="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Nom (optionnel)"
            placeholder="Jean Dupont"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreate} loading={saving}>
            Ajouter
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'abonné"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedSubscriber?.email}" ?`}
        confirmText="Supprimer"
        variant="danger"
        loading={saving}
      />
    </div>
  );
}
