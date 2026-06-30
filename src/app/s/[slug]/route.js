import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    // Kumpulkan header dari request pengunjung asli
    const clientIp = request.ip || request.headers.get("x-forwarded-for") || "";
    const userAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    // 1. Tembak API ke server backend shortlink dengan meneruskan headers
    const res = await fetch(`http://127.0.0.1:8000/api/resolve/${slug}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Forwarded-For": clientIp, // Meneruskan IP pengunjung
        "X-Forwarded-User-Agent": userAgent, // Meneruskan OS/Browser (Perangkat)
        "X-Forwarded-Referer": referer, // Meneruskan asal lalu lintas (IG/WA)
      },
    });

    if (res.ok) {
      const data = await res.json();
      // 2. Redirect ke link asli
      return NextResponse.redirect(new URL(data.long_url));
    }
  } catch (error) {
    console.error("Shortlink error di Next.js:", error);
  }

  // 3. 404
  const baseUrl = request.nextUrl.origin;
  return NextResponse.redirect(new URL("/404", baseUrl));
}
