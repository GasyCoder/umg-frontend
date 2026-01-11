"use client";

import { useState } from "react";
import { publicPost } from "@/lib/public-api";
import { Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await publicPost<{ message: string }>("/newsletter/subscribe", { email });
      setStatus("success");
      setMessage(res.message);
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "Une erreur est survenue.");
    }
  };

  return (
    <div className="w-full">
      {status === "success" ? (
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 flex items-start justify-between gap-2">
          <div>
             <p className="font-semibold text-sm">Information</p>
             <p className="text-xs mt-1">{message}</p>
          </div>
          <button 
            onClick={() => { setStatus("idle"); setEmail(""); }}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
            title="Actualiser"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input 
            className="h-10 flex-1 rounded border border-[#cbd5e1] dark:border-none bg-white dark:bg-white/10 px-4 text-sm text-[#1e293b] dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-[#135bec] focus:outline-none" 
            placeholder="Votre email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <button 
            type="submit"
            disabled={status === "loading"}
            className="h-10 rounded bg-[#135bec] px-6 text-sm font-bold text-white hover:bg-[#0d4abf] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
          >
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "S'abonner"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 mt-2">{message}</p>
      )}
    </div>
  );
}
