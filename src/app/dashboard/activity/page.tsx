import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function ActivityPage() {
  const session = await auth();

  const currentUser = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  const isAdmin = currentUser?.role === "ADMIN";

  const activities = await prisma.activityLog.findMany({
    where: isAdmin ? {} : { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: true },
  });

  const actionColors: Record<string, string> = {
    CREATE: "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400",
    UPDATE: "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-400",
    DELETE: "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400",
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Riwayat Aktivitas</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Log aktivitas {isAdmin ? "semua pengguna" : "Anda"}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {activities.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-start gap-4">
                <div className="mt-0.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${actionColors[activity.action] ?? "bg-gray-100 text-gray-600"}`}>
                    {activity.action === "CREATE" ? "Buat" : activity.action === "UPDATE" ? "Ubah" : "Hapus"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-white/90">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{activity.user.name}</span>
                    <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                    <span className="text-xs text-gray-400">
                      {format(activity.createdAt, "dd MMM yyyy, HH:mm", { locale: id })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
