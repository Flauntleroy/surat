import { signIn } from "@/lib/auth";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 dark:bg-gray-900 z-1 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
        <svg width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
            <rect width="1200" height="600" fill="url(#paint0_radial)" />
          </mask>
          <g mask="url(#mask0)">
            <rect width="1200" height="600" fill="none" />
            <g opacity="0.4">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 30} x2="1200" y2={i * 30} stroke="currentColor" strokeOpacity="0.05" />
              ))}
              {Array.from({ length: 40 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="600" stroke="currentColor" strokeOpacity="0.05" />
              ))}
            </g>
          </g>
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 0) scale(600 600)">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          {/* <Image src="/LogoDWP.png" alt="Logo DWP" width={64} height={64} className="mx-auto mb-4 rounded-xl object-contain" priority /> */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Nomor Surat DWP</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sistem Penomoran Surat Digital</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Selamat Datang</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masuk untuk mengelola nomor surat
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Masuk dengan Google
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
            Gunakan akun Google Anda untuk masuk dengan aman
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          DWP Marabahan
        </p>
      </div>
    </div>
  );
}
