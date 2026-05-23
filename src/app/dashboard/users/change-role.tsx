"use client";

import { changeUserRole } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ChangeRoleButton({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();
  const newRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";

  async function handleClick() {
    const label = newRole === "ADMIN" ? "Admin" : "Anggota";
    if (!confirm(`Ubah role user ini menjadi ${label}?`)) return;

    const result = await changeUserRole(userId, newRole);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Role berhasil diubah menjadi ${label}`);
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition ${
        currentRole === "ADMIN"
          ? "text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          : "text-brand-600 bg-brand-50 hover:bg-brand-100 dark:text-brand-400 dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
      }`}
    >
      {currentRole === "ADMIN" ? "Jadikan Anggota" : "Jadikan Admin"}
    </button>
  );
}
