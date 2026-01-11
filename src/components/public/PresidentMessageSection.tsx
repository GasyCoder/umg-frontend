"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import type { PresidentMessage } from "@/lib/types";

interface PresidentMessageSectionProps {
  message?: PresidentMessage;
}

export function PresidentMessageSection({ message }: PresidentMessageSectionProps) {
  if (!message) return null;

  return (
    <section className="py-20 bg-[#1b4332]/5 dark:bg-white/5">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Photo Side */}
          <div className="w-full lg:w-1/3 relative">
            {/* Decoration Circle */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#d4af37] rounded-full opacity-20"></div>
            
            {/* Photo */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
              {message.photo?.url ? (
                <Image
                  src={message.photo.url}
                  alt={message.president_name}
                  width={400}
                  height={500}
                  className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-gradient-to-br from-[#1b4332] to-[#0f2920]" />
              )}
            </div>

            {/* Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#d4af37] p-6 rounded-xl shadow-lg z-20">
              <p className="text-[#1b4332] font-black leading-tight uppercase tracking-tight">
                {message.president_title || "Recteur de l'Université"}
              </p>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-7/12">
            {/* Quote Icon */}
            <Quote className="w-16 h-16 text-[#d4af37] mb-6 opacity-30 transform -scale-x-100" />
            
            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-black text-[#1b4332] dark:text-white mb-8">
              {message.title}
            </h2>
            
            {/* Content */}
            <div className="text-xl text-gray-700 dark:text-gray-300 italic leading-relaxed mb-8">
              {message.intro ? (
                <div dangerouslySetInnerHTML={{ __html: message.intro }} />
              ) : (
                <p>"{message.content.substring(0, 400)}..."</p>
              )}
            </div>
            
            {/* Signature */}
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-[#d4af37]"></div>
              <p className="font-bold text-lg text-[#1b4332] dark:text-[#d4af37]">
                {message.president_name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
