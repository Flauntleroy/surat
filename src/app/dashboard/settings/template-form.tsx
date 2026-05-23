"use client";

import { createTemplate } from "./actions";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { generateLetterNumber } from "@/lib/letter-utils";

const CATEGORIES = [
  "Surat Keluar",
  "Surat Masuk",
  "Undangan",
  "Surat Keputusan (SK)",
  "Surat Tugas",
  "Surat Keterangan",
  "Notulen",
  "Lainnya",
];

export function TemplateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [format, setFormat] = useState("");
  const [prefix, setPrefix] = useState("");
  const [division, setDivision] = useState("");

  const preview = format
    ? generateLetterNumber(format, {
        number: 1,
        prefix: prefix || null,
        division: division || null,
        date: new Date(),
      })
    : null;

  async function handleSubmit(formData: FormData) {
    const result = await createTemplate(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Template berhasil dibuat");
      formRef.current?.reset();
      setFormat("");
      setPrefix("");
      setDivision("");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Nama Template *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Surat Keluar"
            className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Kategori *
          </label>
          <select
            id="category"
            name="category"
            required
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="format" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Format *
          </label>
          <input
            id="format"
            name="format"
            type="text"
            required
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="{PREFIX}/{NUMBER}/{DIVISION}/{MONTH}/{YEAR}"
            className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label htmlFor="prefix" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Prefix
          </label>
          <input
            id="prefix"
            name="prefix"
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="B"
            className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          />
        </div>
        <div>
          <label htmlFor="division" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Divisi
          </label>
          <input
            id="division"
            name="division"
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            placeholder="Sekr.DWP-Distan TPH"
            className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          />
        </div>
      </div>

      {/* Live Preview */}
      {preview && (
        <div className="rounded-lg border border-brand-200 bg-brand-25 p-3 dark:border-brand-800 dark:bg-brand-950/20">
          <p className="text-xs font-medium text-brand-700 dark:text-brand-400 mb-1">Preview Nomor Surat:</p>
          <p className="text-sm font-mono font-semibold text-brand-600 dark:text-brand-300">{preview}</p>
          <p className="text-[10px] text-brand-500/70 mt-1">* Nomor urut dimulai dari 001, bulan & tahun sesuai tanggal surat</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          id="resetYearly"
          name="resetYearly"
          type="checkbox"
          defaultChecked={true}
          className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
        />
        <label htmlFor="resetYearly" className="text-sm text-gray-700 dark:text-gray-400">
          Reset nomor urut setiap awal tahun
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
      >
        Simpan Template
      </button>
    </form>
  );
}
