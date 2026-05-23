import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const letter = await prisma.letter.findUnique({
    where: { id },
    include: { template: true, user: true },
  });

  if (!letter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Generate printable HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Surat ${letter.generatedNo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', serif; padding: 40px 60px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
    .header p { font-size: 12px; margin-top: 4px; color: #555; }
    .nomor { margin-bottom: 20px; }
    .nomor table td { padding: 3px 10px 3px 0; font-size: 14px; vertical-align: top; }
    .nomor table td:first-child { width: 100px; }
    .content { margin-top: 30px; font-size: 14px; line-height: 1.8; }
    .content p { margin-bottom: 10px; }
    .footer { margin-top: 60px; }
    .footer .sign { float: right; text-align: center; width: 200px; }
    .footer .sign .name { margin-top: 80px; font-weight: bold; text-decoration: underline; }
    .meta { margin-top: 100px; clear: both; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #999; }
    @media print { body { padding: 20px 40px; } .meta { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Dharma Wanita Persatuan</h1>
    <p>Sistem Penomoran Surat Digital</p>
  </div>

  <div class="nomor">
    <table>
      <tr><td>Nomor</td><td>: <strong>${letter.generatedNo}</strong></td></tr>
      <tr><td>Perihal</td><td>: ${letter.subject}</td></tr>
      ${letter.recipient ? `<tr><td>Kepada</td><td>: ${letter.recipient}</td></tr>` : ""}
      <tr><td>Tanggal</td><td>: ${format(letter.letterDate, "dd MMMM yyyy", { locale: idLocale })}</td></tr>
    </table>
  </div>

  ${letter.notes ? `<div class="content"><p>${letter.notes.replace(/\n/g, "</p><p>")}</p></div>` : ""}

  <div class="footer">
    <div class="sign">
      <p>${format(letter.letterDate, "dd MMMM yyyy", { locale: idLocale })}</p>
      <p class="name">${letter.user.name ?? "________________"}</p>
    </div>
  </div>

  <div class="meta">
    <p>Dicetak dari Sistem Nomor Surat DWP pada ${format(new Date(), "dd MMM yyyy HH:mm", { locale: idLocale })}</p>
    <p>Template: ${letter.template.name} | Dibuat oleh: ${letter.user.name}</p>
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
