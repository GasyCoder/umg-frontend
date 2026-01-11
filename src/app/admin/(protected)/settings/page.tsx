"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Globe,
  Image as ImageIcon,
  Search,
  Share2,
  Shield,
  Save,
  AlertTriangle,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { SkeletonFormPage } from "@/components/ui/Skeleton";

type SettingItem = {
  key: string;
  value: string | null;
  type: string;
  group: string;
};

type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "social" | "maintenance" | "stats">("general");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Media for logo and favicon
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        const map: Record<string, string> = {};
        (json.data || []).forEach((s: SettingItem) => {
          map[s.key] = s.value || "";
        });
        setSettings(map);

        // Load logo and favicon URLs if IDs exist
        if (map.logo_id) {
          const logoRes = await fetch(`/api/admin/media/${map.logo_id}`);
          if (logoRes.ok) {
            const logoData = await logoRes.json();
            setLogoUrl(logoData.data?.url || null);
          }
        }
        if (map.favicon_id) {
          const faviconRes = await fetch(`/api/admin/media/${map.favicon_id}`);
          if (faviconRes.ok) {
            const faviconData = await faviconRes.json();
            setFaviconUrl(faviconData.data?.url || null);
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        showToast("error", "Erreur lors du chargement des paramètres");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }));
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });
      if (res.ok) {
        showToast("success", "Paramètres enregistrés avec succès !");
      } else {
        showToast("error", "Erreur lors de la sauvegarde");
      }
    } catch {
      showToast("error", "Erreur de connexion au serveur");
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadImage = async (type: "logo" | "favicon", file: File) => {
    if (type === "logo") setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", type === "logo" ? "Logo du site" : "Favicon du site");

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const mediaId = data.data?.id;
        const mediaUrl = data.data?.url;

        if (mediaId) {
          updateSetting(type === "logo" ? "logo_id" : "favicon_id", String(mediaId));
          if (type === "logo") setLogoUrl(mediaUrl);
          else setFaviconUrl(mediaUrl);
          showToast("success", `${type === "logo" ? "Logo" : "Favicon"} téléchargé avec succès !`);
        }
      } else {
        showToast("error", "Erreur lors du téléchargement");
      }
    } catch {
      showToast("error", "Erreur de connexion");
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  const removeImage = (type: "logo" | "favicon") => {
    updateSetting(type === "logo" ? "logo_id" : "favicon_id", "");
    if (type === "logo") setLogoUrl(null);
    else setFaviconUrl(null);
    showToast("success", `${type === "logo" ? "Logo" : "Favicon"} supprimé`);
  };

  const tabs = [
    { id: "general", label: "Général", icon: <Globe className="w-4 h-4" /> },
    { id: "stats", label: "Chiffres Clés", icon: <Globe className="w-4 h-4" /> },
    { id: "seo", label: "SEO", icon: <Search className="w-4 h-4" /> },
    { id: "social", label: "Réseaux sociaux", icon: <Share2 className="w-4 h-4" /> },
    { id: "maintenance", label: "Maintenance", icon: <Shield className="w-4 h-4" /> },
  ];

  if (loading) {
    return <SkeletonFormPage />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-in-up ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Paramètres du site</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Configuration générale, SEO et maintenance</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "general" && (
            <>
              {/* Logo & Favicon */}
              <Card>
                <CardHeader>Identité visuelle</CardHeader>
                <CardBody>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Logo */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Logo du site
                      </label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        {logoUrl ? (
                          <div className="relative group">
                            <img
                              src={logoUrl}
                              alt="Logo"
                              className="max-h-24 mx-auto object-contain"
                            />
                            <button
                              onClick={() => removeImage("logo")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 cursor-pointer py-4">
                            {uploadingLogo ? (
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-slate-400" />
                                <span className="text-sm text-slate-500">Cliquez pour télécharger</span>
                                <span className="text-xs text-slate-400">PNG, JPG, SVG - Max 2MB</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImage("logo", file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Favicon */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Favicon
                      </label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        {faviconUrl ? (
                          <div className="relative group flex justify-center">
                            <img
                              src={faviconUrl}
                              alt="Favicon"
                              className="w-16 h-16 object-contain"
                            />
                            <button
                              onClick={() => removeImage("favicon")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 cursor-pointer py-4">
                            {uploadingFavicon ? (
                              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 text-slate-400" />
                                <span className="text-sm text-slate-500">Cliquez pour télécharger</span>
                                <span className="text-xs text-slate-400">ICO, PNG - 32x32 ou 64x64</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*,.ico"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadImage("favicon", file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* General Info */}
              <Card>
                <CardHeader>Informations générales</CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <Input
                      label="Nom du site"
                      value={settings.site_name || ""}
                      onChange={(e) => updateSetting("site_name", e.target.value)}
                      placeholder="Université de Mahajanga"
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Description du site
                      </label>
                      <textarea
                        value={settings.site_description || ""}
                        onChange={(e) => updateSetting("site_description", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                        placeholder="Description de votre site..."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Email de contact"
                        type="email"
                        value={settings.site_email || ""}
                        onChange={(e) => updateSetting("site_email", e.target.value)}
                        placeholder="contact@umahajanga.mg"
                      />
                      <Input
                        label="Téléphone"
                        value={settings.site_phone || ""}
                        onChange={(e) => updateSetting("site_phone", e.target.value)}
                        placeholder="+261 20 XX XXX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Adresse
                      </label>
                      <textarea
                        value={settings.site_address || ""}
                        onChange={(e) => updateSetting("site_address", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}

          {activeTab === "stats" && (
            <Card>
              <CardHeader>Chiffres Clés</CardHeader>
              <CardBody>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Étudiants"
                    type="number"
                    value={settings.stat_students || ""}
                    onChange={(e) => updateSetting("stat_students", e.target.value)}
                    placeholder="15000"
                  />
                  <Input
                    label="Personnels"
                    type="number"
                    value={settings.stat_staff || ""}
                    onChange={(e) => updateSetting("stat_staff", e.target.value)}
                    placeholder="500"
                  />
                  <Input
                    label="Formations"
                    type="number"
                    value={settings.stat_formations || ""}
                    onChange={(e) => updateSetting("stat_formations", e.target.value)}
                    placeholder="50"
                  />
                  <Input
                    label="Établissements"
                    type="number"
                    value={settings.stat_establishments || ""}
                    onChange={(e) => updateSetting("stat_establishments", e.target.value)}
                    placeholder="8"
                  />
                  <Input
                    label="Services"
                    type="number"
                    value={settings.stat_services || ""}
                    onChange={(e) => updateSetting("stat_services", e.target.value)}
                    placeholder="30"
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "seo" && (
            <Card>
              <CardHeader>Optimisation SEO</CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input
                    label="Meta Title"
                    value={settings.meta_title || ""}
                    onChange={(e) => updateSetting("meta_title", e.target.value)}
                    placeholder="Université de Mahajanga - Madagascar"
                    helperText="Affiché dans les résultats de recherche"
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.meta_description || ""}
                      onChange={(e) => updateSetting("meta_description", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      placeholder="Description pour les moteurs de recherche..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Maximum 160 caractères recommandés</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Mots-clés
                    </label>
                    <textarea
                      value={settings.meta_keywords || ""}
                      onChange={(e) => updateSetting("meta_keywords", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      placeholder="université, mahajanga, madagascar, enseignement supérieur"
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "social" && (
            <Card>
              <CardHeader>Réseaux sociaux</CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input
                    label="Facebook"
                    value={settings.facebook_url || ""}
                    onChange={(e) => updateSetting("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                  <Input
                    label="Twitter / X"
                    value={settings.twitter_url || ""}
                    onChange={(e) => updateSetting("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                  <Input
                    label="LinkedIn"
                    value={settings.linkedin_url || ""}
                    onChange={(e) => updateSetting("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                  <Input
                    label="YouTube"
                    value={settings.youtube_url || ""}
                    onChange={(e) => updateSetting("youtube_url", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "maintenance" && (
            <Card>
              <CardHeader>Mode maintenance</CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Activer le mode maintenance</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Le site public sera inaccessible
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenance_mode === "true"}
                      onChange={(e) => updateSetting("maintenance_mode", e.target.checked ? "true" : "false")}
                      className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Message de maintenance
                    </label>
                    <textarea
                      value={settings.maintenance_message || ""}
                      onChange={(e) => updateSetting("maintenance_message", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder="Le site est en maintenance..."
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
