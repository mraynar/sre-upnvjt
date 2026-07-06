import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return new NextResponse("Missing fileId", { status: 400 });
  }

  // Google Drive direct download URL with bypass virus scan flag
  const targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

  try {
    // Forward Range header if it exists
    const headers = new Headers();
    const range = request.headers.get("range");
    if (range) {
      headers.set("Range", range);
    }

    const res = await fetch(targetUrl, {
      method: "GET",
      headers,
    });

    if (!res.ok && res.status !== 206) {
      return new NextResponse(`Failed to fetch PDF from Google Drive: ${res.statusText}`, { status: res.status });
    }

    // Pass back important headers for chunked streaming
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/pdf");
    responseHeaders.set("Cache-Control", "public, max-age=86400");
    
    // Pass Google Drive's range headers back to the client
    const contentRange = res.headers.get("content-range");
    const contentLength = res.headers.get("content-length");
    const acceptRanges = res.headers.get("accept-ranges");
    
    if (contentRange) responseHeaders.set("Content-Range", contentRange);
    if (contentLength) responseHeaders.set("Content-Length", contentLength);
    if (acceptRanges) responseHeaders.set("Accept-Ranges", acceptRanges);

    // Return the stream directly to the client with the same status (200 or 206)
    return new NextResponse(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("PDF Proxy Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
