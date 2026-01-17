"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Image,
  File,
  FileText,
  Video,
  Music,
  Grid,
  List,
  Upload,
  X,
  ZoomIn,
  Download,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";

type MediaItem = {
  id: number;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
  width?: number;
  height?: number;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<globalThis.File[]>([]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/media?per_page=100");
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const getFileIcon = (type: string) => {
    if (!type) return <File className="w-6 h-6 text-slate-500 dark:text-slate-400" />;
    if (type.startsWith("image/")) return <Image className="w-6 h-6 text-blue-500" />;
    if (type.startsWith("video/")) return <Video className="w-6 h-6 text-purple-500" />;
    if (type.startsWith("audio/")) return <Music className="w-6 h-6 text-pink-500" />;
    if (type.includes("pdf")) return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-slate-500 dark:text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFilesSelection = (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadError(null);
    setSelectedFiles(fileArray);
    setUploadModalOpen(true);
  };

  const handleUploadConfirm = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
    const tokenRes = await fetch("/api/auth/token", { credentials: "include" });
    const tokenData = tokenRes.ok ? await tokenRes.json().catch(() => null) : null;
    const authHeader = tokenData?.token ? { Authorization: `Bearer ${tokenData.token}` } : {};

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${apiUrl}/admin/media`, {
          method: "POST",
          body: formData,
          credentials: "include", // Important for sending cookies cross-domain
          headers: authHeader,
        });

        if (!res.ok) {
          if (res.status === 413) {
            throw new Error("Fichier trop volumineux (limite serveur).");
          }
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || `L'upload de ${file.name} a échoué.`);
        }
      }
      
      setUploadModalOpen(false);
      setSelectedFiles([]);
      await load(); // Refresh list
    } catch (e: any) {
      console.error("Upload failed", e);
      setUploadError(e.message || "Erreur lors de l'upload. Vérifiez la taille/format du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelection(e.dataTransfer.files);
    }
  };

  async function handleDelete() {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/admin/media/${selectedItem.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        setSelectedItem(null);
        load();
      }
    } catch (e) {
      // Handle error
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  const totalSize = items.reduce((acc, item) => acc + (item.size || 0), 0);
  const imageCount = items.filter((i) => i.type && i.type.startsWith("image/")).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Médiathèque</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez vos images et fichiers</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <label>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFilesSelection(e.target.files)}
            />
            <span className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-all">
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Télécharger
                </>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total fichiers"
          value={items.length}
          icon={<File className="w-6 h-6" />}
          color="indigo"
        />
        <StatCard
          title="Images"
          value={imageCount}
          icon={<Image className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Espace utilisé"
          value={formatFileSize(totalSize)}
          icon={<Upload className="w-6 h-6" />}
          color="emerald"
        />
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
        <p className="text-slate-600 dark:text-slate-300 mb-2">
          Glissez-déposez vos fichiers ici ou{" "}
          <label className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer font-medium">
            parcourez
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFilesSelection(e.target.files)}
            />
          </label>
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">PNG, JPG, PDF, DOC jusqu'à 10MB</p>
      </div>

      {/* Upload Preview Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
            if (!uploading) {
                setUploadModalOpen(false);
                setSelectedFiles([]);
            }
        }}
        title={`Confirmer l'upload (${selectedFiles.length} fichier${selectedFiles.length > 1 ? 's' : ''})`}
        size="lg"
      >
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-2">
                {selectedFiles.map((file, i) => (
                    <div key={i} className="relative group bg-slate-50 dark:bg-slate-700 rounded-lg p-2 border border-slate-200 dark:border-slate-600">
                        <button 
                            onClick={() => setSelectedFiles(selectedFiles.filter((_, idx) => idx !== i))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 shadow-sm hover:bg-red-600 transition-colors z-10"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="aspect-square bg-slate-200 dark:bg-slate-600 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                />
                            ) : (
                                <File className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                        <p className="text-xs text-center truncate text-slate-700 dark:text-slate-300 font-medium">
                            {file.name}
                        </p>
                        <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                             {formatFileSize(file.size)}
                        </p>
                    </div>
                ))}
            </div>

            {uploadError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {uploadError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-700 pt-4">
                <Button variant="ghost" onClick={() => setUploadModalOpen(false)} disabled={uploading}>
                    Annuler
                </Button>
                <Button onClick={handleUploadConfirm} loading={uploading} icon={<Upload className="w-4 h-4" />}>
                    {uploading ? "Upload en cours..." : "Uploader les fichiers"}
                </Button>
            </div>
        </div>
      </Modal>

      {/* Media Grid/List */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all border border-transparent dark:border-slate-700"
              onClick={() => setPreviewItem(item)}
            >
              {item.type && item.type.startsWith("image/") ? (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  {getFileIcon(item.type)}
                  <span className="text-xs text-slate-500 dark:text-slate-400 text-center px-2 truncate max-w-full">
                    {item.filename}
                  </span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(item);
                  }}
                  className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(item.url);
                  }}
                  className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {item.type && item.type.startsWith("image/") ? (
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(item.type)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">{item.filename}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatFileSize(item.size)} • {new Date(item.uploaded_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(item.url)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  title="Copier l'URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <Modal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title={previewItem.filename}
          size="xl"
        >
          <div className="flex flex-col items-center">
            {previewItem.type.startsWith("image/") ? (
              <img
                src={previewItem.url}
                alt={previewItem.filename}
                className="max-h-[60vh] rounded-lg"
              />
            ) : (
              <div className="p-12 bg-slate-100 dark:bg-slate-700 rounded-xl">
                {getFileIcon(previewItem.type)}
              </div>
            )}
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatFileSize(previewItem.size)}
                {previewItem.width && ` • ${previewItem.width}×${previewItem.height}px`}
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Copy className="w-4 h-4" />}
                  onClick={() => copyToClipboard(previewItem.url)}
                >
                  Copier l'URL
                </Button>
                <a href={previewItem.url} download>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Télécharger
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le fichier"
        message={`Êtes-vous sûr de vouloir supprimer "${selectedItem?.filename}" ?`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
}
