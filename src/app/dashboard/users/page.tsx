import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChangeRoleButton } from "./change-role";

export default async function UsersPage() {
  const session = await auth();

  // Check admin access
  const currentUser = await prisma.user.findUnique({ where: { id: session!.user!.id } });
  if (currentUser?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { letters: true } } },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Kelola User</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Atur role pengguna. Admin bisa melihat semua surat dan mengelola user.
        </p>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">User</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Surat</th>
                <th className="px-6 py-3.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Bergabung</th>
                <th className="px-6 py-3.5 w-[120px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                          <span className="text-brand-600 text-xs font-medium">
                            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {user.name ?? "Tanpa Nama"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {user.role === "ADMIN" ? "Admin" : "Anggota"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {user._count.letters}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {format(user.createdAt, "dd MMM yyyy", { locale: id })}
                  </td>
                  <td className="px-6 py-4">
                    {user.id !== session!.user!.id && (
                      <ChangeRoleButton
                        userId={user.id}
                        currentRole={user.role}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
