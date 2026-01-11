"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import {
  ChevronDown,
  Menu,
  X,
  Search,
  FileText,
  Landmark,
} from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const nav = [
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
  { href: "/partenaires", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

interface SiteHeaderProps {
  settings?: SiteSettings | null;
}

export default function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#101622] border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3">
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.site_name} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="size-10 text-[#1b4332] dark:text-[#d4af37]">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                  </svg>
                </div>
              )}
              <div>
                <h2 className="text-gray-900 dark:text-white text-base md:text-lg font-bold leading-tight">
                  {settings?.site_name || "Université de Mahajanga"}
                </h2>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-8">
              {nav.map((item) => (
                <div key={item.href} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                        className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                          isActive(item.href)
                            ? "text-[#d4af37]"
                            : "text-gray-900 dark:text-gray-300 hover:text-[#d4af37]"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {/* Dropdown */}
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-white dark:bg-[#101622] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 min-w-[200px]">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1b4332] dark:hover:text-[#d4af37] transition-colors"
                            >
                              <child.icon className="w-4 h-4 text-gray-400" />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm font-semibold transition-colors ${
                        isActive(item.href)
                          ? "text-[#d4af37]"
                          : "text-gray-900 dark:text-gray-300 hover:text-[#d4af37]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-[#1b4332] text-sm text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="xl:hidden py-4 space-y-1 border-t border-gray-100 dark:border-gray-800 animate-slide-in-up">
            {nav.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                      isActive(item.href)
                        ? "text-[#d4af37] bg-[#1b4332]/10"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </header>
  );
}
