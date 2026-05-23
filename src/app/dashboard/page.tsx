import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { MonthlyChart } from "@/components/charts/monthly-chart";

export default async function DashboardPage() {
  const session = await auth();

  const [totalLetters, totalTemplates, recentLetters] = await Promise.all([
    prisma.letter.count({ where: { userId: session!.user!.id } }),
    prisma.letterTemplate.count(),
    prisma.letter.findMany({
      where: { userId: session!.user!.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { template: true },
    }),
  ]);

  const currentMonth = new Date();
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lettersThisMonth = await prisma.letter.count({
    where: {
      userId: session!.user!.id,
      createdAt: { gte: startOfMonth },
    },
  });

  // Monthly chart data
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
  const lettersThisYear = await prisma.letter.findMany({
    where: {
      userId: session!.user!.id,
      letterDate: { gte: startOfYear, lte: endOfYear },
    },
    select: { letterDate: true },
  });

  const monthlyData = Array(12).fill(0);
  lettersThisYear.forEach((letter) => {
    const month = new Date(letter.letterDate).getMonth();
    monthlyData[month]++;
  });

  return (
    <>
      <PageBreadcrumb pageTitle="Dashboard" />

      {/* Welcome */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Selamat datang, {session!.user!.name?.split(" ")[0]}! 👋
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Berikut ringkasan aktivitas penomoran surat Anda.
            </p>
          </div>
          <Link
            href="/dashboard/letters/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Surat Baru
          </Link>
        </div>
      </div>

      {/* Stats - swipeable on mobile */}
      <div className="mb-6 -mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar">
        <div className="flex gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4 w-max sm:w-auto">
          <div className="w-[240px] sm:w-auto shrink-0 sm:shrink rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Surat</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{totalLetters}</h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
                <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-[240px] sm:w-auto shrink-0 sm:shrink rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bulan Ini</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{lettersThisMonth}</h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 dark:bg-success-500/10">
                <svg className="w-6 h-6 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-[240px] sm:w-auto shrink-0 sm:shrink rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Template</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{totalTemplates}</h4>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-[240px] sm:w-auto shrink-0 sm:shrink rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rata-rata</p>
                <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                  {totalLetters > 0 ? Math.ceil(totalLetters / Math.max(totalTemplates, 1)) : 0}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">surat/template</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light-50 dark:bg-blue-light-500/10">
                <svg className="w-6 h-6 text-blue-light-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Recent Letters - reorder on mobile: letters first, chart second */}
      <div className="flex flex-col-reverse sm:flex-col gap-6">
        {/* Monthly Chart */}
        <MonthlyChart data={monthlyData} year={currentYear} />

        {/* Recent Letters */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Surat Terbaru
          </h3>
          {recentLetters.length > 0 && (
            <Link
              href="/dashboard/letters"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Lihat Semua →
            </Link>
          )}
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800">
          {recentLetters.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-gray-800 dark:text-white/90">Belum ada surat</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Buat template dulu di Pengaturan, lalu buat surat pertama.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700"
                >
                  Buat Template
                </Link>
                <Link
                  href="/dashboard/letters/new"
                  className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                >
                  + Buat Surat
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Nomor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Perihal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400 hidden sm:table-cell">Template</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentLetters.map((letter) => (
                    <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90 font-mono">
                        {letter.generatedNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {letter.subject}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                          {letter.template.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {format(letter.createdAt, "dd MMM yyyy", { locale: id })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
