"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { MultiSelect } from "@/components/ui/MultiSelect";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Use `use` unwrapping for params (Next.js 15+ pattern)
  const resolvedParams = use(params);
  const postId = resolvedParams.id;

  // Configuration data
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content_html: "",
    category_ids: [] as number[],
    tag_ids: [] as number[],
    status: "draft",
    notify_subscribers: false,
  });

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, catsRes, tagsRes] = await Promise.all([
          fetch(`/api/admin/posts/${postId}`),
          fetch("/api/admin/categories?per_page=100"),
          fetch("/api/admin/tags?per_page=100"),
        ]);

        if (!postRes.ok) throw new Error("Post not found");
        
        const postData = await postRes.json();
        const catsData = await catsRes.json();
        const tagsData = await tagsRes.json();

        const post = postData.data;
        
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            content_html: post.content_html || "",
            category_ids: post.categories?.map((c: any) => c.id) || [],
            tag_ids: post.tags?.map((t: any) => t.id) || [],
            status: post.status,
            notify_subscribers: false, // Default to false on edit to avoid accidental re-send
        });

        setCategories(catsData.data || []);
        setTags(tagsData.data || []);
      } catch (error) {
        console.error("Failed to load data", error);
        alert("Erreur lors du chargement de l'article");
        router.push("/admin/posts");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [postId, router]);

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      // Don't auto-update slug on edit mode to preserve SEO
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/posts");
      } else {
          const err = await res.json();
          alert("Erreur: " + (err.message || "Impossible de mettre à jour l'article"));
      }
    } catch (e) {
        console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const tagOptions = tags.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  if (loading) {
      return <div className="p-8 text-center text-slate-500 animate-pulse">Chargement...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Modifier l'article
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Édition de : {formData.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                onClick={() => router.back()}
            >
                Annuler
            </Button>
            <Button
                onClick={handleSubmit}
                loading={saving}
                icon={<Save className="w-4 h-4" />}
            >
                Mettre à jour
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardBody className="space-y-6">
              <Input
                label="Titre"
                placeholder="Titre de l'article"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="text-lg font-semibold"
              />
              
              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                helperText="URL de l'article"
              />

              <Input
                label="Extrait"
                value={formData.excerpt}
                onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Court résumé..."
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contenu
                </label>
                <RichTextEditor
                  value={formData.content_html}
                  onChange={(val) =>
                    setFormData({ ...formData, content_html: val })
                  }
                  minHeight="min-h-[400px]"
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-1 space-y-6">
            {/* Status & Visibility */}
            <Card>
                <CardHeader>Publication</CardHeader>
                <CardBody className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Statut
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="draft">Brouillon</option>
                            <option value="published">Publié</option>
                            <option value="archived">Archivé</option>
                        </select>
                    </div>

                    {formData.status === 'published' && (
                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50">
                            <div className="mt-0.5">
                                <input
                                    type="checkbox"
                                    id="notify"
                                    checked={formData.notify_subscribers}
                                    onChange={(e) => setFormData({ ...formData, notify_subscribers: e.target.checked })}
                                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                />
                            </div>
                            <label htmlFor="notify" className="text-sm cursor-pointer select-none">
                                <span className="font-medium text-amber-900 dark:text-amber-100 block">Renvoyer aux abonnés</span>
                                <span className="text-amber-700 dark:text-amber-300 text-xs">Attention : cela créera une NOUVELLE campagne.</span>
                            </label>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Categorization */}
            <Card>
                <CardHeader>Classement</CardHeader>
                <CardBody className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Catégories
                        </label>
                        <MultiSelect
                            options={categoryOptions}
                            value={formData.category_ids}
                            onChange={(ids) => setFormData({ ...formData, category_ids: ids as number[] })}
                            placeholder="Sélectionner..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Tags
                        </label>
                        <MultiSelect
                            options={tagOptions}
                            value={formData.tag_ids}
                            onChange={(ids) => setFormData({ ...formData, tag_ids: ids as number[] })}
                            placeholder="Ajouter des tags..."
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
      </div>
    </div>
  );
}
