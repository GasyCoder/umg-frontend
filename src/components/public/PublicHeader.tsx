"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  GraduationCap, 
  Laptop, 
  Mail, 
  Lock, 
  ChevronDown, 
  Search, 
  Menu, 
  X
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { SiteSettings } from "@/lib/types";

interface PublicHeaderProps {
  settings?: SiteSettings | null;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export default function PublicHeader({ settings }: PublicHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      label: 'Université',
      children: [
        { label: 'Historique', href: '/universite/historique' },
        { label: 'Organisation', href: '/universite/organisation' },
        { label: 'Textes et arrêtés', href: '/universite/textes' },
      ]
    },
    { label: 'Établissements', href: '/etablissements' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'Partenariats', href: '/partenaires' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Topbar */}
      <div className="relative z-[60] bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-2 px-4 md:px-10 text-xs font-medium transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-between items-center">
          <div className="flex gap-6">
            <Link className="hover:text-primary dark:hover:text-blue-400 transition-colors flex items-center gap-1.5" href="#">
              <GraduationCap className="w-4 h-4 text-accent" /> Bibliothèque
            </Link>
            <Link className="hover:text-primary dark:hover:text-blue-400 transition-colors flex items-center gap-1.5" href="#">
              <Laptop className="w-4 h-4 text-accent" /> Espaces Numériques
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:flex gap-4 items-center">
              <Link className="hover:text-primary dark:hover:text-blue-400 transition-colors" href="https://webmail.univ-mahajanga.mg" target="_blank">Webmail</Link>
              <span className="text-slate-300">|</span>
              <Link className="hover:text-primary dark:hover:text-blue-400 transition-colors flex items-center gap-1" href="/admin/login">
                <Lock className="w-3 h-3" /> Intranet
              </Link>
            </div>
            
            <div className="flex items-center gap-1 cursor-pointer bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <span className="font-bold text-primary dark:text-blue-400">FR</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
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
                <h1 className="text-primary dark:text-white text-xl font-black leading-none tracking-tight group-hover:text-primary-light dark:group-hover:text-blue-300 transition-colors">
                    {settings?.site_name || "UMG"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold">Université de Mahajanga</p>
                </div>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group/dropdown">
                {item.children ? (
                  <button 
                    className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link 
                    href={item.href || '#'}
                    className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && (
                  <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all transform translate-y-2 group-hover/dropdown:translate-y-0">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href || '#'}
                          className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-blue-400 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="size-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:flex bg-accent hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-amber-500/20 items-center gap-2 hover:-translate-y-0.5">
              <span>Candidater</span>
            </button>
            <button 
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
                <nav className="flex flex-col p-4 gap-2">
                    {navItems.map((item) => (
                      <div key={item.label}>
                         {item.children ? (
                           <>
                              <button 
                                onClick={() => setDropdownOpen(dropdownOpen === item.label ? null : item.label)}
                                className="flex w-full items-center justify-between text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 px-4 py-3 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                {item.label}
                                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen === item.label ? 'rotate-180' : ''}`} />
                              </button>
                              {dropdownOpen === item.label && (
                                <div className="pl-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-2">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.label}
                                      href={child.href || '#'}
                                      className="block px-4 py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 border-l-2 border-transparent hover:border-primary dark:hover:border-blue-400 ml-2"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                           </>
                         ) : (
                            <Link 
                                href={item.href || '#'}
                                className="block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 px-4 py-3 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                         )}
                      </div>
                    ))}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
                    <Link href="/candidater" className="text-center bg-accent hover:bg-amber-600 text-white px-5 py-3 rounded-lg text-sm font-bold transition-colors">
                        Candidater
                    </Link>
                </nav>
            </div>
        )}
      </header>
    </>
  );
}
