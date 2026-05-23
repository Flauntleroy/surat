import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { EditLetterForm } from "./edit-form";
import { AttachmentSection } from "./attachments";

export default async function LetterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const letter = await prisma.letter.findUnique({
    where: { id },
    include: { template: true, user: true, attachments: true },
  });

  if (!letter) notFound();

  // Check access: owner or admin
  const currentUser = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  const isAdmin = currentUser?.role === "ADMIN";
  const isOwner = letter.userId === session!.user!.id;

  if (!isOwner && !isAdmin) notFound();

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
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Surat</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{letter.generatedNo}</p>
        </div>
        {/* Print/PDF button */}
        <a
          href={`/api/letters/${letter.id}/pdf`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / PDF
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main - Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Edit Surat</h3>
            </div>
            <div className="p-6">
              <EditLetterForm letter={letter} />
            </div>
          </div>
        </div>

        {/* Sidebar - Info & Attachments */}
        <div className="space-y-6">
          {/* Info */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">Informasi</h3>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Template</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{letter.template.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Nomor Urut</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{letter.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Dibuat oleh</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{letter.user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tanggal dibuat</span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {format(letter.createdAt, "dd MMM yyyy HH:mm", { locale: idLocale })}
                </span>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <AttachmentSection letterId={letter.id} attachments={letter.attachments} />
        </div>
      </div>
    </>
  );
}
