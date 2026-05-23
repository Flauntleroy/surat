"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LetterSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    router.push(`/dashboard/letters?${params.toString()}`);
  }

  function handleReset() {
    setQ("");
    setFrom("");
    setTo("");
    router.push("/dashboard/letters");
  }

  return (
    <form onSubmit={handleSearch} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="space-y-3">
        {/* Search input - full width */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Cari</label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nomor, perihal, atau penerima..."
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          />
        </div>

        {/* Date range - side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Dari</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">Sampai</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="h-10 flex-1 sm:flex-none rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 transition"
          >
            Cari
          </button>
          {(q || from || to) && (
            <button
              type="button"
              onClick={handleReset}
              className="h-10 flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
