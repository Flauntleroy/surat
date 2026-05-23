import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if admin (export all) or member (export own)
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isAdmin = currentUser?.role === "ADMIN";

  const letters = await prisma.letter.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { template: true, user: true },
  });

  // Generate CSV
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const headers = ["No", "Nomor Surat", "Perihal", "Penerima", "Kategori", "Template", "Tanggal Surat", "Dibuat Oleh", "Tanggal Input"];
  
  const rows = letters.map((letter, index) => [
    index + 1,
    `"${letter.generatedNo}"`,
    `"${letter.subject.replace(/"/g, '""')}"`,
    `"${letter.recipient ?? "-"}"`,
    `"${letter.category}"`,
    `"${letter.template.name}"`,
    format(letter.letterDate, "dd/MM/yyyy", { locale: idLocale }),
    `"${letter.user.name ?? "-"}"`,
    format(letter.createdAt, "dd/MM/yyyy HH:mm", { locale: idLocale }),
  ]);

  const csv = BOM + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const filename = `surat_dwp_${format(new Date(), "yyyyMMdd_HHmm")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
