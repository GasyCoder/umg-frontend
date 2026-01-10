"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications" | "appearance">("profile");
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "Administrateur",
    email: "admin@umg.mg",
    phone: "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    emailNewPost: true,
    emailNewSubscriber: true,
    emailNewDocument: false,
    browserNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "light" as "light" | "dark" | "system",
    language: "fr",
    sidebarCollapsed: false,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: <User className="w-4 h-4" /> },
    { id: "password", label: "Mot de passe", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "appearance", label: "Apparence", icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mon Profil</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Gérez vos informations personnelles et préférences</p>
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
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>Informations du profil</CardHeader>
              <CardBody>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    A
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Changer la photo</Button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG max 2MB</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Adresse email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button onClick={handleSaveProfile} loading={saving} icon={<Save className="w-4 h-4" />}>
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "password" && (
            <Card>
              <CardHeader>Changer le mot de passe</CardHeader>
              <CardBody>
                <div className="max-w-md space-y-4">
                  <Input
                    label="Mot de passe actuel"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                  <Input
                    label="Nouveau mot de passe"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                    helperText="Minimum 8 caractères"
                  />
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-4 h-4" />}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button icon={<Save className="w-4 h-4" />}>Mettre à jour</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>Préférences de notifications</CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { key: "emailNewPost", label: "Nouveau article publié", desc: "Recevoir un email à chaque publication" },
                    { key: "emailNewSubscriber", label: "Nouvel abonné", desc: "Notification pour chaque nouvel abonné" },
                    { key: "emailNewDocument", label: "Nouveau document", desc: "Email lors de l'ajout d'un document" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl cursor-pointer">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={(notifications as Record<string, boolean>)[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600"
                      />
                    </label>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <Button icon={<Save className="w-4 h-4" />}>Enregistrer</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>Apparence</CardHeader>
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Thème</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "light", label: "Clair", icon: "☀️" },
                        { id: "dark", label: "Sombre", icon: "🌙" },
                        { id: "system", label: "Système", icon: "💻" },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setAppearance({ ...appearance, theme: theme.id as typeof appearance.theme })}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            appearance.theme === theme.id
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{theme.icon}</span>
                          <span className="text-sm font-medium">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter>
                <Button icon={<Save className="w-4 h-4" />}>Enregistrer</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
