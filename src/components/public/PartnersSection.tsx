"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Partner } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_URL}/partners?is_active=1`, {
          headers: { Accept: "application/json" },
          cache: 'no-store'
        });
        if (res.ok) {
          const json = await res.json();
          setPartners(json.data || []);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-8">
            Nos Partenaires
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Nos Partenaires
          </p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Ils nous font confiance
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group relative"
              title={partner.name}
            >
              {partner.website_url ? (
                <Link
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="h-16 w-32 relative flex items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md grayscale hover:grayscale-0">
                    {partner.logo_url ? (
                      <Image
                        src={partner.logo_url}
                        alt={partner.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">
                        {partner.name}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="h-16 w-32 relative flex items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 grayscale">
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">
                      {partner.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
