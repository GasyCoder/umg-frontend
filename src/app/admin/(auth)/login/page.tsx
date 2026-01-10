"use client";

import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j?.message ?? "Échec de la connexion");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <GraduationCap className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Université de Mahajanga</h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Bienvenue sur le panneau d'administration. Gérez votre contenu en toute simplicité.
          </p>
          
          {/* Features */}
          <div className="mt-16 grid grid-cols-2 gap-6 max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">1200+</div>
              <div className="text-sm text-white/70">Étudiants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/70">Professeurs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-white/70">Formations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-white/70">Sécurisé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Connexion Admin
            </h2>
            <p className="text-slate-600">
              Entrez vos identifiants pour accéder au tableau de bord
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            <Input
              label="Adresse email"
              type="email"
              placeholder="admin@umg.mg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Mot de passe oublié?
              </button>
            </div>

            {/* Error Message */}
            {err && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-slide-in-up">
                <p className="font-medium">Erreur de connexion</p>
                <p className="text-red-600">{err}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full py-3"
              size="lg"
            >
              Se connecter
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Connexion sécurisée avec cookie httpOnly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}