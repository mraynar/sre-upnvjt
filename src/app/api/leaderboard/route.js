import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user, memberProfile, division, xpTransaction } from "@/db/schema";
import { eq, desc, gte, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * GET /api/leaderboard?period=all|month|week
 *
 * Kenapa period query param, bukan 3 endpoint terpisah?
 * → Satu endpoint, satu kontrak — lebih mudah di-maintain.
 * → Client cukup ganti URL param, tidak perlu hafal banyak endpoint.
 *
 * Cara kerja per period:
 * - "all"   → ambil dari memberProfile.xp (total XP sepanjang waktu)
 * - "month" → SUM(xpTransaction.amount) WHERE createdAt >= awal bulan ini
 * - "week"  → SUM(xpTransaction.amount) WHERE createdAt >= awal minggu ini (Senin)
 */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") ?? "all";

    let ranked = [];

    if (period === "all") {
      // ─── ALL TIME: pakai memberProfile.xp langsung ─────────────────
      const data = await db
        .select({
          id:                user.id,
          name:              user.name,
          npm:               user.npm,
          profilePictureUrl: user.profilePictureUrl,
          xp:                memberProfile.xp,
          level:             memberProfile.level,
          divisionName:      division.name,
        })
        .from(memberProfile)
        .innerJoin(user, eq(user.id, memberProfile.userId))
        .leftJoin(division, eq(division.id, user.divisionId))
        .orderBy(desc(memberProfile.xp));

      ranked = data.map((item, idx) => ({ ...item, rank: idx + 1 }));

    } else {
      // ─── PERIOD-BASED: query dari xpTransaction ─────────────────────
      const now = new Date();
      let startDate;

      if (period === "month") {
        // Awal bulan ini
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        // Awal minggu ini (Senin)
        const dayOfWeek = now.getDay(); // 0=Minggu, 1=Senin, ...
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
        startDate = new Date(now);
        startDate.setDate(now.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);
      }

      // SUM XP per user dari xpTransaction dalam rentang waktu
      const xpByUser = await db
        .select({
          userId:   xpTransaction.userId,
          totalXp:  sql`COALESCE(SUM(${xpTransaction.amount}), 0)`.as("totalXp"),
        })
        .from(xpTransaction)
        .where(gte(xpTransaction.createdAt, startDate))
        .groupBy(xpTransaction.userId)
        .orderBy(desc(sql`totalXp`));

      // Kalau tidak ada transaksi sama sekali, return array kosong
      if (xpByUser.length === 0) {
        return NextResponse.json([]);
      }

      // Join dengan data user untuk nama, foto, divisi
      const userIds = xpByUser.map((r) => r.userId);
      const users = await db
        .select({
          id:                user.id,
          name:              user.name,
          npm:               user.npm,
          profilePictureUrl: user.profilePictureUrl,
          level:             memberProfile.level,
          divisionName:      division.name,
        })
        .from(user)
        .leftJoin(memberProfile, eq(memberProfile.userId, user.id))
        .leftJoin(division, eq(division.id, user.divisionId));

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

      ranked = xpByUser
        .map((row, idx) => ({
          ...userMap[row.userId],
          xp:   Number(row.totalXp),
          rank: idx + 1,
        }))
        .filter((item) => item.name); // filter jika user tidak ditemukan
    }

    return NextResponse.json(ranked);
  } catch (error) {
    console.error("[leaderboard] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
