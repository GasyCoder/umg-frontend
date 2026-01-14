"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Laptop,
  BookOpen,
  Mail,
  ChevronDown,
  Search,
  Menu,
  X,
  History,
  Building2,
  FileText,
  Globe
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { SiteSettings } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface TopbarLinks {
  library: { label: string; url: string };
  webmail: { label: string; url: string };
  digital: { label: string; url: string };
}

interface PublicHeaderProps {
  settings?: SiteSettings | null;
}

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export default function PublicHeader({ settings }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hash, setHash] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"FR" | "EN">("FR");
  const [topbarLinks, setTopbarLinks] = useState<TopbarLinks>({
    library: { label: "Bibliothèque", url: "#" },
    webmail: { label: "Webmail", url: "#" },
    digital: { label: "Espace Numérique", url: "#" },
  });

  // Fetch topbar links
  useEffect(() => {
    const fetchTopbar = async () => {
      try {
        const res = await fetch(`${API_URL}/topbar`, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setTopbarLinks(data);
        }
      } catch (error) {
        console.error("Error fetching topbar:", error);
      }
    };
    fetchTopbar();
  }, []);

  // Écouter les changements de hash dans l'URL
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Close lang dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setLangOpen(false);
    if (langOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [langOpen]);

  const navItems: NavItem[] = [
    {
      label: 'Université',
      children: [
        { label: 'Historique', href: '/universite/historique', icon: History },
        { label: 'Organisation', href: '/universite/organisation', icon: Building2 },
        { label: 'Textes et arrêtés', href: '/universite/textes', icon: FileText },
      ]
    },
    { label: 'Établissements', href: '/etablissements' },
    { label: 'Services', href: '/services' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'Partenaires', href: '/#partenaires' },
    { label: 'Contact', href: '/contact' },
  ];

  // Vérifier si un lien est actif
  const isActive = (href?: string) => {
    if (!href) return false;
    // Liens ancrés (ex: /#partenaires) - actif SEULEMENT si hash correspond exactement
    if (href.startsWith('/#')) {
      const targetHash = href.replace('/', ''); // "#partenaires"
      return hash === targetHash;
    }
    // Autres liens normaux
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Vérifier si un dropdown contient un lien actif
  const hasActiveChild = (children?: NavItem[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.href));
  };

  return (
    <>
      {/* Topbar */}
      <div className="relative z-[60] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-2 px-4 md:px-10 text-xs font-medium transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-between items-center">
          <div className="flex gap-6">
            <Link
              className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-1.5"
              href={topbarLinks.library.url}
              target={topbarLinks.library.url.startsWith("http") ? "_blank" : undefined}
              rel={topbarLinks.library.url.startsWith("http") ? "noopener noreferrer" : undefined}>
              <BookOpen className="w-4 h-4 text-amber-500" /> {topbarLinks.library.label}
            </Link>
            <Link
              className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-1.5"
              href={topbarLinks.digital.url}
              target={topbarLinks.digital.url.startsWith("http") ? "_blank" : undefined}
              rel={topbarLinks.digital.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <Laptop className="w-4 h-4 text-amber-500" /> {topbarLinks.digital.label}
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex gap-4 items-center">
              <Link
                className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-1.5"
                href={topbarLinks.webmail.url}
                target={topbarLinks.webmail.url.startsWith("http") ? "_blank" : undefined}
                rel={topbarLinks.webmail.url.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <Mail className="w-3.5 h-3.5" /> {topbarLinks.webmail.label}
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen(!langOpen);
                }}
                className="flex items-center gap-1.5 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden min-w-[100px] z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang("FR");
                      setLangOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                      currentLang === "FR"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="w-5 h-4 rounded overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center text-[10px] font-bold">FR</span>
                    Français
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang("EN");
                      setLangOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                      currentLang === "EN"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="w-5 h-4 rounded overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center text-[10px] font-bold">EN</span>
                    English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="size-10 bg-primary rounded-lg text-white flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:bg-primary-light transition-colors">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <GraduationCap className="w-6 h-6 fill-current" />
                )}
              </div>
              <div>
                <h1 className="text-primary dark:text-white text-xl font-bold leading-none tracking-tight group-hover:text-primary-light dark:group-hover:text-blue-300 transition-colors">
                  {settings?.site_name || "UMG"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Université pour le développement</p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = item.children ? hasActiveChild(item.children) : isActive(item.href);

              return (
                <div key={item.label} className="relative group/dropdown">
                  {item.children ? (
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        active
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        active
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && (
                    <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all transform translate-y-2 group-hover/dropdown:translate-y-0">
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden py-1">
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          const childActive = isActive(child.href);
                          return (
                            <Link
                              key={child.label}
                              href={child.href || '#'}
                              className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                                childActive
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-500'
                              }`}
                            >
                              {Icon && <Icon className={`w-4 h-4 ${childActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button type="button" className="size-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/candidater" className="hidden md:flex bg-accent hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-amber-500/20 items-center gap-2 hover:-translate-y-0.5">
              Candidater
            </Link>
            <button
              type="button"
              className="lg:hidden text-slate-800 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-lg animate-slide-in-up max-h-[80vh] overflow-y-auto">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => {
                const active = item.children ? hasActiveChild(item.children) : isActive(item.href);

                return (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                          className={`flex w-full items-center justify-between px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                            active
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {item.label}
                          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                        </button>
                        {dropdownOpen === item.label && (
                          <div className="pl-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-2">
                            {item.children.map((child) => {
                              const Icon = child.icon;
                              const childActive = isActive(child.href);
                              return (
                                <Link
                                  key={child.label}
                                  href={child.href || '#'}
                                  className={`flex items-center gap-2 px-4 py-3 text-sm border-l-2 ml-2 ${
                                    childActive
                                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 font-semibold'
                                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-blue-600 dark:hover:text-blue-500 hover:border-blue-600 dark:hover:border-blue-500'
                                  }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {Icon && <Icon className="w-4 h-4" />}
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className={`block px-4 py-3 text-sm font-bold rounded-lg transition-colors ${
                          active
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
              <Link
                href="/candidater"
                className="text-center bg-accent hover:bg-amber-600 text-white px-5 py-3 rounded-lg text-sm font-bold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Candidater
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
