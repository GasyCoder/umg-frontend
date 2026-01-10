"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import {
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Building2,
  FileText,
  Landmark,
  Users,
  Phone,
} from "lucide-react";

const nav = [
  { href: "/", label: "Accueil" },
  {
    href: "/universite",
    label: "Université",
    children: [
      { href: "/universite/historique", label: "Historique", icon: FileText },
      { href: "/universite/organisation", label: "Organisation", icon: Landmark },
      { href: "/universite/textes", label: "Textes & Arrêtés", icon: FileText },
    ],
  },
  { href: "/etablissements", label: "Établissements" },
  { href: "/actualites", label: "Actualités" },
  { href: "/documents", label: "Documents" },
  { href: "/partenariats", label: "Partenariats" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-slate-900 text-sm">Université de Mahajanga</p>
              <p className="text-xs text-slate-500">Madagascar</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[200px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <child.icon className="w-4 h-4 text-slate-400" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Espace Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-slate-100 animate-slide-in-up">
            {nav.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.href ? "rotate-180" : ""}`} />
                    </button>
                    {openDropdown === item.href && (
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                            onClick={() => setMobileOpen(false)}
                          >
                            <child.icon className="w-4 h-4" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(item.href) ? "text-indigo-600 bg-indigo-50" : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/admin"
                className="block w-full text-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Espace Admin
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}