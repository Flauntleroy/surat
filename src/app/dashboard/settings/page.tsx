import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getFormatPlaceholders } from "@/lib/letter-utils";
import { TemplateForm } from "./template-form";
import { TemplateList } from "./template-list";

export default async function SettingsPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  if (currentUser?.role !== "ADMIN") redirect("/dashboard");

  const templates = await prisma.letterTemplate.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { letters: true } } },
  });

  const placeholders = getFormatPlaceholders();

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Pengaturan Template</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Atur format penomoran surat sesuai kebutuhan</p>
      </div>

      <div className="space-y-6">
        {/* Format Guide */}
        <div className="rounded-2xl border border-brand-100 bg-brand-25 dark:border-brand-900 dark:bg-brand-950/20">
          <div className="px-6 py-4">
            <h3 className="text-sm font-medium text-brand-700 dark:text-brand-400">Panduan Format</h3>
            <p className="text-xs text-brand-600/70 dark:text-brand-400/70 mt-0.5">Gunakan placeholder berikut dalam format template</p>
          </div>
          <div className="px-6 pb-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {placeholders.map((p) => (
                <div key={p.key} className="flex items-center gap-2">
                  <code className="rounded bg-white px-2 py-0.5 text-xs font-mono font-medium text-brand-700 border border-brand-200 dark:bg-gray-800 dark:border-brand-800 dark:text-brand-400">
                    {p.key}
                  </code>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{p.description}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-white border border-brand-200 p-3 dark:bg-gray-800 dark:border-brand-800">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Contoh:</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                {"{PREFIX}/{NUMBER}/{DIVISION}/{MONTH}/{YEAR}"} → <span className="text-brand-600 dark:text-brand-400 font-medium">SKL/001/DWP/V/2025</span>
              </p>
            </div>
          </div>
        </div>

        {/* Create Template */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Buat Template Baru</h3>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 p-6">
            <TemplateForm />
          </div>
        </div>

        {/* Template List */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Template Tersedia</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-400">
              {templates.length}
            </span>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 p-6">
            <TemplateList templates={templates} />
          </div>
        </div>
      </div>
    </>
  );
}
