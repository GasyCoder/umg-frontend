"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CreateSlidePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    cta_text: "",
    cta_url: "",
    post_id: "",
    category_id: "",
    bg_color_light: "bg-blue-900",
    bg_color_dark: "bg-slate-800",
    order: "0",
    is_active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/posts?per_page=100&status=published", { credentials: "include" }),
          fetch("/api/admin/categories?per_page=100", { credentials: "include" }),
        ]);

        if (postsRes.ok) {
          const data = await postsRes.json();
          setPosts(data.data?.data || data.data || []);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.data?.data || data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      if (form.subtitle) formData.append("subtitle", form.subtitle);
      if (form.description) formData.append("description", form.description);
      if (form.cta_text) formData.append("cta_text", form.cta_text);
      if (form.cta_url) formData.append("cta_url", form.cta_url);
      if (form.post_id) formData.append("post_id", form.post_id);
      if (form.category_id) formData.append("category_id", form.category_id);
      formData.append("bg_color_light", form.bg_color_light);
      formData.append("bg_color_dark", form.bg_color_dark);
      formData.append("order", form.order);
      formData.append("is_active", form.is_active ? "1" : "0");
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("/api/admin/slides", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        router.push("/admin/slides");
      } else {
        const data = await res.json();
        alert(data.message || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Error creating slide:", error);
      alert("Erreur lors de la création");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/slides"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Nouveau slide
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Créer un nouveau slide pour le carrousel
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Upload */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Image du slide
            </h3>
            {imagePreview ? (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Cliquez pour télécharger
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  PNG, JPG jusqu&apos;à 5MB (1920x1080 recommandé)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Title & Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Titre *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Titre principal du slide"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Sous-titre
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sous-titre optionnel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description optionnelle..."
              />
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Bouton d&apos;action (CTA)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Texte du bouton
                </label>
                <input
                  type="text"
                  value={form.cta_text}
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: En savoir plus"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  URL du bouton
                </label>
                <input
                  type="text"
                  value={form.cta_url}
                  onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: /actualites/mon-article"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Ou lier à une actualité
              </label>
              <select
                value={form.post_id}
                onChange={(e) => setForm({ ...form, post_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Sélectionner une actualité --</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Si une actualité est sélectionnée, le CTA redirigera vers cette actualité
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Publication
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Catégorie
              </label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Sélectionner une catégorie --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Couleur de fond (mode clair)
              </label>
              <select
                value={form.bg_color_light}
                onChange={(e) => setForm({ ...form, bg_color_light: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bg-blue-900">Bleu foncé (défaut)</option>
                <option value="bg-blue-800">Bleu</option>
                <option value="bg-blue-700">Bleu moyen</option>
                <option value="bg-indigo-900">Indigo foncé</option>
                <option value="bg-indigo-800">Indigo</option>
                <option value="bg-purple-900">Violet foncé</option>
                <option value="bg-purple-800">Violet</option>
                <option value="bg-pink-900">Rose foncé</option>
                <option value="bg-pink-800">Rose</option>
                <option value="bg-red-900">Rouge foncé</option>
                <option value="bg-red-800">Rouge</option>
                <option value="bg-orange-900">Orange foncé</option>
                <option value="bg-orange-800">Orange</option>
                <option value="bg-amber-900">Ambre foncé</option>
                <option value="bg-amber-800">Ambre</option>
                <option value="bg-yellow-900">Jaune foncé</option>
                <option value="bg-yellow-800">Jaune</option>
                <option value="bg-green-900">Vert foncé</option>
                <option value="bg-green-800">Vert</option>
                <option value="bg-emerald-900">Émeraude foncé</option>
                <option value="bg-emerald-800">Émeraude</option>
                <option value="bg-teal-900">Sarcelle foncé</option>
                <option value="bg-teal-800">Sarcelle</option>
                <option value="bg-cyan-900">Cyan foncé</option>
                <option value="bg-cyan-800">Cyan</option>
                <option value="bg-sky-900">Ciel foncé</option>
                <option value="bg-sky-800">Ciel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Couleur de fond (mode sombre)
              </label>
              <select
                value={form.bg_color_dark}
                onChange={(e) => setForm({ ...form, bg_color_dark: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bg-slate-950">Ardoise très foncé</option>
                <option value="bg-slate-900">Ardoise foncé</option>
                <option value="bg-slate-800">Ardoise (défaut)</option>
                <option value="bg-slate-700">Ardoise moyen</option>
                <option value="bg-gray-950">Gris très foncé</option>
                <option value="bg-gray-900">Gris foncé</option>
                <option value="bg-gray-800">Gris</option>
                <option value="bg-zinc-950">Zinc très foncé</option>
                <option value="bg-zinc-900">Zinc foncé</option>
                <option value="bg-zinc-800">Zinc</option>
                <option value="bg-neutral-950">Neutre très foncé</option>
                <option value="bg-neutral-900">Neutre foncé</option>
                <option value="bg-neutral-800">Neutre</option>
                <option value="bg-stone-950">Pierre très foncé</option>
                <option value="bg-stone-900">Pierre foncé</option>
                <option value="bg-stone-800">Pierre</option>
                <option value="bg-blue-950">Bleu très foncé</option>
                <option value="bg-blue-900">Bleu foncé</option>
                <option value="bg-indigo-950">Indigo très foncé</option>
                <option value="bg-indigo-900">Indigo foncé</option>
                <option value="bg-purple-950">Violet très foncé</option>
                <option value="bg-purple-900">Violet foncé</option>
                <option value="bg-green-950">Vert très foncé</option>
                <option value="bg-green-900">Vert foncé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Slide actif
              </span>
            </label>

            <button
              type="submit"
              disabled={saving || !form.title}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Enregistrement..." : "Créer le slide"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
