import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  // Di Next.js modern, 'params' sifatnya asinkronus, jadi wajib di-await
  const { slug } = await params;

  try {
    // 1. Tembak API ke server backend shortlink untuk cari link asli
    const res = await fetch(`http://127.0.0.1:8000/api/resolve/${slug}`, {
      cache: "no-store", // Wajib agar Next.js tidak nge-cache hasil shortlink lama
    });

    if (res.ok) {
      const data = await res.json();

      // 2. Jika ketemu, langsung tembak redirect ke link tujuan (bisa web luar/GForm/Drive)
      return NextResponse.redirect(new URL(data.long_url));
    }
  } catch (error) {
    console.error("Shortlink error di Next.js:", error);
  }

  // 3. Jika slug tidak terdaftar atau API error, lempar ke 404 web utama
  const baseUrl = request.nextUrl.origin; // Mengambil domain utama (sre-upnjatim.com)
  return NextResponse.redirect(new URL("/404", baseUrl));
}
