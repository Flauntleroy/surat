import { prisma } from "@/lib/prisma";
import { NewLetterForm } from "./form";
import Link from "next/link";

export default async function NewLetterPage() {
  const templates = await prisma.letterTemplate.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/letters"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Buat Surat Baru</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Nomor surat digenerate otomatis berdasarkan template</p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <svg className="w-12 h-12 mx-auto text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-4 text-base font-medium text-gray-800 dark:text-white/90">Belum Ada Template</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Buat template penomoran surat terlebih dahulu di halaman Pengaturan.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-4 inline-flex items-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Buat Template
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Detail Surat</h3>
          </div>
          <div className="p-6">
            <NewLetterForm templates={templates} />
          </div>
        </div>
      )}
    </>
  );
}
