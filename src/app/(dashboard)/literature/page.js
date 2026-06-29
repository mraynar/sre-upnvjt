import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import { getCategories, getLiteratureItems } from "@/app/actions/literatureActions";
import LiteratureClient from "./LiteratureClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Literature Bank | SRE Portal",
  description: "Kelola bank literatur dan referensi SRE UPNVJT.",
};

export default async function LiteraturePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/login");
  if (!hasAccess(session.user, "literature", "read")) {
    redirect("/dashboard");
  }

  const [categoriesRes, itemsRes] = await Promise.all([
    getCategories(),
    getLiteratureItems(),
  ]);

  return (
    <LiteratureClient
      initialCategories={categoriesRes.data || []}
      initialItems={itemsRes.data || []}
      currentUser={session.user}
    />
  );
}
