import Link from 'next/link';
import Container from './Container';
import type { SiteSettings } from '@/lib/types';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

interface SiteFooterProps {
  settings?: SiteSettings | null;
}

export default function SiteFooter({ settings }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  const social = settings?.social;

  return (
    <footer className="bg-white dark:bg-[#101622] text-[#1e293b] dark:text-white pt-16 pb-8 border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              {settings?.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.site_name} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="material-symbols-outlined text-3xl text-[#135bec]">account_balance</span>
              )}
              <span className="text-sm font-bold tracking-tight text-[#1e293b] dark:text-white leading-tight">
                {settings?.site_name || "Université de Mahajanga"}
              </span>
            </Link>
            <p className="text-sm text-[#64748b] dark:text-gray-400 leading-relaxed">
              {settings?.site_description || "L'excellence académique au service du développement durable et de l'innovation."}
            </p>
          </div>

          {/* Quick Links 1 */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#135bec] mb-6">Université</h3>
            <ul className="space-y-3 text-sm text-[#64748b] dark:text-gray-400">
              <li><Link href="/universite" className="hover:text-[#135bec] dark:hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/etablissements" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Nos Établissements</Link></li>
              <li><Link href="/universite/historique" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Historique</Link></li>
              <li><Link href="/partenaires" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Partenaires</Link></li>
            </ul>
          </div>

           {/* Quick Links 2 & Contact */}
           <div className="lg:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#135bec] mb-6">Liens Utiles</h3>
            <ul className="space-y-3 text-sm text-[#64748b] dark:text-gray-400">
              <li><Link href="#" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Espace ENT</Link></li>
              <li><Link href="#" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Bibliothèque</Link></li>
              <li><Link href="/actualites" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Actualités</Link></li>
              <li><Link href="/contact" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social & contact */}
          <div className="lg:col-span-1 space-y-6">
             <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#135bec]">Suivez-nous</h3>
                <div className="flex flex-wrap gap-2">
                  {social?.facebook && social.facebook !== '#' && (
                    <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-[#64748b] dark:text-gray-400 border border-[#e2e8f0] dark:border-white/10 transition-all hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-1">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {social?.twitter && social.twitter !== '#' && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-[#64748b] dark:text-gray-400 border border-[#e2e8f0] dark:border-white/10 transition-all hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] hover:-translate-y-1">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {social?.linkedin && social.linkedin !== '#' && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-[#64748b] dark:text-gray-400 border border-[#e2e8f0] dark:border-white/10 transition-all hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:-translate-y-1">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {social?.instagram && social.instagram !== '#' && (
                    <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-[#64748b] dark:text-gray-400 border border-[#e2e8f0] dark:border-white/10 transition-all hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F] hover:-translate-y-1">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {social?.youtube && social.youtube !== '#' && (
                    <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-white/5 shadow-sm text-[#64748b] dark:text-gray-400 border border-[#e2e8f0] dark:border-white/10 transition-all hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:-translate-y-1">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
             </div>
             
             {/* Mini Contact */}
             <div className="pt-4 border-t border-[#e2e8f0] dark:border-white/10 space-y-2">
                <div className="flex items-center gap-3 text-sm text-[#64748b] dark:text-gray-400">
                    <Mail className="w-4 h-4 text-[#135bec]" />
                    <span>{settings?.site_email || "contact@univ-mahajanga.mg"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#64748b] dark:text-gray-400">
                    <Phone className="w-4 h-4 text-[#135bec]" />
                     <span>{settings?.site_phone || "+261 20 62 225 61"}</span>
                </div>
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e2e8f0] dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
          <p className="text-xs text-[#64748b] dark:text-gray-400">
            © {currentYear} {settings?.site_name || "Université de Mahajanga"}. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-[#64748b] dark:text-gray-400 font-medium">
             <Link href="#" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Mentions Légales</Link>
             <Link href="#" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Politique de Confidentialité</Link>
             <Link href="#" className="hover:text-[#135bec] dark:hover:text-white transition-colors">Plan du site</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}