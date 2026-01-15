"use client";

import { useRef, useState } from "react";
import { Lightbulb, Users, Globe, Award, Play } from "lucide-react";

type AboutSectionProps = {
  videoUrl?: string | null;
  videoPosterUrl?: string | null;
};

export default function AboutSection({ videoUrl, videoPosterUrl }: AboutSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  return (
    <section className="py-16 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Content */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 text-xs font-bold uppercase rounded-full tracking-wider">
                À Propos de L'UMG
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-6">
              Une université <span className="text-primary dark:text-blue-400">dédiée à l'avenir</span> et à l'innovation
            </h2>
            
            <div className="prose prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              <p>
                Bienvenue à l'Université de Mahajanga. Notre mission est de fournir une éducation de qualité supérieure accessible à tous, tout en favorisant la recherche et le développement durable de notre région.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Innovation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recherche appliquée aux besoins locaux.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Inclusion</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Une chance pour chaque talent.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Ouverture</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Partenariats à l'international.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 text-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Excellence</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Formations de haut niveau.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a href="/etablissements" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary-light transition-colors shadow-lg shadow-blue-900/10">
                Voir tous nos établissements
              </a>
            </div>
          </div>

          {/* Video / Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute -right-4 -bottom-4 w-2/3 h-2/3 bg-slate-100 dark:bg-slate-800 rounded-2xl -z-10"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                controls
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                poster={
                  videoPosterUrl ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcpjwCYNIEJfBuhZ1IHDeBOHrR4PVVxEDu_xqJVpLCisZNz5JjtFVICSnSujXPhiUJ6EVumFAE4I6jfhzazjnR_Y-9PzjLWcjF7e9_f1ysmQAhRjSqVM__i9m03z70PIfh5xJIQ33pbumIqE17sm3vvjaPw1MdxHC9RwwmI4kLvditZqu5mzrpUfvVcGIeQyTyEe830Ao7OuMZNARkWqb1B6mupfZnwtC5oTZm9gqGYvA_Ehq64Yka-Pqvguf1SK3cRwqaamk4xPo"
                }
              >
                <source src={videoUrl || "/videos/umg-about.mp4"} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
              <div
                className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isPlaying ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="size-14 rounded-full bg-white/85 text-primary shadow-lg flex items-center justify-center transition-transform duration-300">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
