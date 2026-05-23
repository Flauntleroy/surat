"use client";

import { createLetterWithAttachments } from "../actions";
import { useState, useRef } from "react";
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

interface Template {
  id: string;
  name: string;
  format: string;
  prefix: string | null;
  division: string | null;
  category: string;
}

export function NewLetterForm({ templates }: { templates: Template[] }) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [letterDate, setLetterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState("Surat Keluar");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const preview = selectedTemplate
    ? generateLetterNumber(selectedTemplate.format, {
        number: 1,
        prefix: selectedTemplate.prefix,
        division: selectedTemplate.division,
        date: new Date(letterDate),
      })
    : null;

  function handleFileAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    const validFiles = newFiles.filter((f) => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < newFiles.length) {
      alert("Beberapa file melebihi 5MB dan tidak ditambahkan");
    }
    setFiles((prev) => [...prev, ...validFiles]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleSubmit(formData: FormData) {
    // Append files to formData
    files.forEach((file) => {
      formData.append("attachments", file);
    });
    await createLetterWithAttachments(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Template */}
      <div>
        <label htmlFor="templateId" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Template *
        </label>
        <select
          id="templateId"
          name="templateId"
          required
          onChange={(e) => {
            const t = templates.find((t) => t.id === e.target.value);
            setSelectedTemplate(t ?? null);
            if (t) setCategory(t.category);
          }}
          className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          <option value="">Pilih template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} — {template.category}
            </option>
          ))}
        </select>
        {preview && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Preview: <span className="font-mono font-medium text-brand-600 dark:text-brand-400">{preview}</span>
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-400">Otomatis terisi dari template, bisa diubah</p>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Perihal *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="Perihal surat"
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      {/* Recipient */}
      <div>
        <label htmlFor="recipient" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Penerima
        </label>
        <input
          id="recipient"
          name="recipient"
          type="text"
          placeholder="Nama penerima surat"
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="letterDate" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Tanggal Surat
        </label>
        <input
          id="letterDate"
          name="letterDate"
          type="date"
          value={letterDate}
          onChange={(e) => setLetterDate(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Catatan
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Catatan tambahan (opsional)"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      {/* Attachments */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Lampiran
        </label>

        {files.length > 0 && (
          <div className="mb-3 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">({formatFileSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-error-500 transition-colors ml-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 hover:bg-brand-25 dark:hover:border-brand-800 transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">Tambah lampiran (maks 5MB/file)</span>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            multiple
            onChange={handleFileAdd}
          />
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
      >
        Buat Surat
      </button>
    </form>
  );
}
