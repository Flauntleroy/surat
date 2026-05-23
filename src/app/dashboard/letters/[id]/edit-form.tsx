"use client";

import { updateLetter } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Letter {
  id: string;
  subject: string;
  recipient: string | null;
  notes: string | null;
  letterDate: Date;
}

export function EditLetterForm({ letter }: { letter: Letter }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await updateLetter(letter.id, formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Surat berhasil diperbarui");
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Perihal *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          defaultValue={letter.subject}
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      <div>
        <label htmlFor="recipient" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Penerima
        </label>
        <input
          id="recipient"
          name="recipient"
          type="text"
          defaultValue={letter.recipient ?? ""}
          placeholder="Nama penerima surat"
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      <div>
        <label htmlFor="letterDate" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Tanggal Surat
        </label>
        <input
          id="letterDate"
          name="letterDate"
          type="date"
          defaultValue={new Date(letter.letterDate).toISOString().split("T")[0]}
          className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Catatan
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={letter.notes ?? ""}
          placeholder="Catatan tambahan"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
      >
        Simpan Perubahan
      </button>
    </form>
  );
}
