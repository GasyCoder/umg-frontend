"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Send,
  Mail,
  Users,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  Archive,
  RotateCcw,
  Filter,
} from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";

type CampaignStatus = "draft" | "scheduled" | "sent" | "sending" | "archived";

type Campaign = {
  id: number;
  subject: string;
  status: CampaignStatus;
  recipients_count: number;
  opens_count: number;
  clicks_count: number;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
};

type StatusFilter = "all" | "draft" | "sending" | "sent" | "archived";

export default function AdminNewsletterPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function load() {
    setLoading(true);
    let url = "/api/admin/newsletter/campaigns?per_page=50";
    
    if (statusFilter === "archived") {
      url += "&status=archived";
    } else if (statusFilter !== "all") {
      url += `&status=${statusFilter}`;
    }
    // For "all", API excludes archived by default
    
    const res = await fetch(url);
    const json = await res.json();
    setCampaigns(json?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, [statusFilter]);

  async function handleSend() {
    if (!selectedCampaign) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${selectedCampaign.id}/send`, {
        method: "POST",
      });
      if (res.ok) {
        setSendModalOpen(false);
        setSelectedCampaign(null);
        load();
      } else {
        const body = await res.json();
        alert(body.message || "Erreur lors de l'envoi");
      }
    } finally {
      setSending(false);
    }
  }

  async function handleDelete() {
    if (!selectedCampaign) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${selectedCampaign.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setSelectedCampaign(null);
        load();
      } else {
        const body = await res.json();
        alert(body.message || "Erreur lors de la suppression");
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleArchive() {
    if (!selectedCampaign) return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${selectedCampaign.id}/archive`, {
        method: "POST",
      });
      if (res.ok) {
        setArchiveModalOpen(false);
        setSelectedCampaign(null);
        load();
      } else {
        const body = await res.json();
        alert(body.message || "Erreur lors de l'archivage");
      }
    } finally {
      setArchiving(false);
    }
  }

  async function handleRestore() {
    if (!selectedCampaign) return;
    setRestoring(true);
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${selectedCampaign.id}/restore`, {
        method: "POST",
      });
      if (res.ok) {
        setRestoreModalOpen(false);
        setSelectedCampaign(null);
        load();
      } else {
        const body = await res.json();
        alert(body.message || "Erreur lors de la restauration");
      }
    } finally {
      setRestoring(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="success" dot>Envoyé</Badge>;
      case "sending":
        return <Badge variant="info" dot>En cours</Badge>;
      case "scheduled":
        return <Badge variant="warning" dot>Programmé</Badge>;
      case "archived":
        return <Badge variant="default" dot>Archivé</Badge>;
      default:
        return <Badge variant="default" dot>Brouillon</Badge>;
    }
  };

  const columns = [
    {
      key: "subject" as keyof Campaign,
      header: "Campagne",
      sortable: true,
      render: (item: Campaign) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${item.status === "archived" ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"} rounded-xl flex items-center justify-center`}>
            {item.status === "archived" ? <Archive className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <p className={`font-medium truncate max-w-xs ${item.status === "archived" ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-white"}`}>{item.subject}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.recipients_count} destinataires
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status" as keyof Campaign,
      header: "Statut",
      sortable: true,
      render: (item: Campaign) => getStatusBadge(item.status),
    },
    {
      key: "opens_count" as keyof Campaign,
      header: "Ouvertures",
      sortable: true,
      render: (item: Campaign) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Eye className="w-4 h-4" />
          {item.opens_count} ({item.recipients_count > 0 ? Math.round((item.opens_count / item.recipients_count) * 100) : 0}%)
        </div>
      ),
    },
    {
      key: "sent_at" as keyof Campaign,
      header: "Date",
      sortable: true,
      render: (item: Campaign) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm">
          <Calendar className="w-4 h-4" />
          {item.sent_at
            ? new Date(item.sent_at).toLocaleDateString("fr-FR")
            : item.scheduled_at
            ? `Prévu: ${new Date(item.scheduled_at).toLocaleDateString("fr-FR")}`
            : "-"}
        </div>
      ),
    },
  ];

  const statusFilters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Toutes" },
    { value: "draft", label: "Brouillons" },
    { value: "sending", label: "En cours" },
    { value: "sent", label: "Envoyées" },
    { value: "archived", label: "Archivées" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Newsletter</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez vos campagnes et abonnés</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/newsletter/subscribers">
            <Button variant="outline" icon={<Users className="w-4 h-4" />}>
              Abonnés
            </Button>
          </Link>
          <Link href="/admin/newsletter/campaigns/create">
            <Button icon={<Plus className="w-4 h-4" />}>Nouvelle campagne</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total campagnes"
          value={campaigns.length}
          icon={<Mail className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Envoyées"
          value={campaigns.filter((c) => c.status === "sent").length}
          icon={<CheckCircle className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Brouillons"
          value={campaigns.filter((c) => c.status === "draft").length}
          icon={<Clock className="w-6 h-6" />}
          color="amber"
        />
        <StatCard
          title="Taux d'ouverture moy."
          value="45%"
          icon={<Eye className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Filtrer :</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                statusFilter === filter.value
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={campaigns}
        keyField="id"
        loading={loading}
        emptyMessage="Aucune campagne trouvée"
        searchPlaceholder="Rechercher une campagne..."
        actions={(item) => (
          <div className="flex items-center gap-1">
            {item.status !== "archived" ? (
              <>
                {/* Send button - only for drafts */}
                {item.status === "draft" && (
                  <button
                    onClick={() => {
                      setSelectedCampaign(item);
                      setSendModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    title="Envoyer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
                
                {/* Edit button - always visible for non-archived */}
                <Link
                  href={`/admin/newsletter/campaigns/${item.id}/edit`}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </Link>

                {/* Archive button */}
                <button
                  onClick={() => {
                    setSelectedCampaign(item);
                    setArchiveModalOpen(true);
                  }}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  title="Archiver"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Restore button - only for archived */}
                <button
                  onClick={() => {
                    setSelectedCampaign(item);
                    setRestoreModalOpen(true);
                  }}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  title="Restaurer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Delete button - only for archived */}
                <button
                  onClick={() => {
                    setSelectedCampaign(item);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la campagne"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedCampaign?.subject}" ?`}
        confirmText="Supprimer"
        variant="danger"
        loading={deleting}
      />

      {/* Send Confirmation */}
      <ConfirmModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onConfirm={handleSend}
        title="Envoyer la campagne"
        message={`Êtes-vous sûr de vouloir envoyer "${selectedCampaign?.subject}" à tous les abonnés actifs ? Cette action est irréversible.`}
        confirmText="Envoyer maintenant"
        variant="primary"
        loading={sending}
      />

      {/* Archive Confirmation */}
      <ConfirmModal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        onConfirm={handleArchive}
        title="Archiver la campagne"
        message={`Êtes-vous sûr de vouloir archiver "${selectedCampaign?.subject}" ? Elle ne sera plus visible dans la liste par défaut.`}
        confirmText="Archiver"
        variant="primary"
        loading={archiving}
      />

      {/* Restore Confirmation */}
      <ConfirmModal
        isOpen={restoreModalOpen}
        onClose={() => setRestoreModalOpen(false)}
        onConfirm={handleRestore}
        title="Restaurer la campagne"
        message={`Êtes-vous sûr de vouloir restaurer "${selectedCampaign?.subject}" ? Elle redeviendra un brouillon.`}
        confirmText="Restaurer"
        variant="primary"
        loading={restoring}
      />
    </div>
  );
}
