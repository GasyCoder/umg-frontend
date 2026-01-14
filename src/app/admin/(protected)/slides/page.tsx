"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, Eye, EyeOff } from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  post: { id: number; title: string; slug: string } | null;
  order: number;
  is_active: boolean;
  created_at: string;
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/admin/slides?per_page=50", {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSlides(data.data?.data || data.data || []);
      }
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce slide ?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setSlides(slides.filter(s => s.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (slide: Slide) => {
    setToggling(slide.id);
    try {
      const res = await fetch(`/api/admin/slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: !slide.is_active }),
      });

      if (res.ok) {
        setSlides(slides.map(s =>
          s.id === slide.id ? { ...s, is_active: !s.is_active } : s
        ));
      }
    } catch (error) {
      console.error("Error toggling slide:", error);
    } finally {
      setToggling(null);
    }
  };

  const activeCount = slides.filter(s => s.is_active).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Slides
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez les slides du carrousel de la page d&apos;accueil
          </p>
        </div>
        <Link
          href="/admin/slides/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau slide
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{slides.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Actifs</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{slides.length - activeCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inactifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Aucun slide
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Commencez par ajouter votre premier slide
          </p>
          <Link
            href="/admin/slides/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau slide
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
              >
                {/* Drag Handle */}
                <div className="cursor-move text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Order */}
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                  {slide.order}
                </div>

                {/* Image Preview */}
                {slide.image_url ? (
                  <div className="relative h-16 w-28 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={slide.image_url}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-16 w-28 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {slide.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {slide.cta_text && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                        CTA: {slide.cta_text}
                      </span>
                    )}
                    {slide.post && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                        Lié: {slide.post.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleActive(slide)}
                  disabled={toggling === slide.id}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    slide.is_active
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  } disabled:opacity-50`}
                >
                  {slide.is_active ? "Actif" : "Inactif"}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/slides/${slide.id}/edit`}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    disabled={deleting === slide.id}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
