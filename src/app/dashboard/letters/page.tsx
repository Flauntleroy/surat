import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { DeleteLetterButton } from "./delete-button";
import { LetterSearch } from "./search";

interface SearchParams {
  q?: string;
  from?: string;
  to?: string;
}

export default async function LettersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  const params = await searchParams;

  // Check if admin
  const currentUser = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  const isAdmin = currentUser?.role === "ADMIN";

  // Build filter
  const where: any = {};

  // Non-admin only sees own letters
  if (!isAdmin) {
    where.userId = session!.user!.id;
  }

  // Search query
  if (params.q) {
    where.OR = [
      { generatedNo: { contains: params.q, mode: "insensitive" } },
      { subject: { contains: params.q, mode: "insensitive" } },
      { recipient: { contains: params.q, mode: "insensitive" } },
    ];
  }

  // Date range
  if (params.from || params.to) {
    where.letterDate = {};
    if (params.from) where.letterDate.gte = new Date(params.from);
    if (params.to) where.letterDate.lte = new Date(params.to + "T23:59:59");
  }

  const letters = await prisma.letter.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { template: true, user: true, _count: { select: { attachments: true } } },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Daftar Surat</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{letters.length} surat {isAdmin ? "(semua pengguna)" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/letters/export"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </a>
          <Link
            href="/dashboard/letters/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Surat
          </Link>
        </div>
      </div>

      {/* Search & Filter */}
      <LetterSearch />

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mt-4">
        {letters.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-4 text-base font-medium text-gray-800 dark:text-white/90">
              {params.q || params.from || params.to ? "Tidak ada hasil" : "Belum ada surat"}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {params.q || params.from || params.to
                ? "Coba ubah kata kunci atau filter pencarian"
                : "Pastikan sudah membuat template di Pengaturan."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Nomor Surat</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Perihal</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 hidden md:table-cell">Penerima</th>
                  {isAdmin && (
                    <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 hidden lg:table-cell">Dibuat oleh</th>
                  )}
                  <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 hidden sm:table-cell">Kategori</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 hidden sm:table-cell">Template</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
                  <th className="px-6 py-3.5 w-[100px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {letters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/dashboard/letters/${letter.id}`} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline font-mono">
                          {letter.generatedNo}
                        </Link>
                        {letter._count.attachments > 0 && (
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {letter.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {letter.recipient ?? "-"}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        {letter.user.name}
                      </td>
                    )}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {letter.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                        {letter.template.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {format(letter.letterDate, "dd MMM yyyy", { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/letters/${letter.id}`}
                          className="text-gray-400 hover:text-brand-500 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <DeleteLetterButton letterId={letter.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
