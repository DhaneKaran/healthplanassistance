import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function PharmacistDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "PHARMACIST") {
    redirect("/dashboard/patient");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pharmacist Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/orders" className="card">
          <h2 className="h2">Manage Orders</h2>
          <p className="text-secondary">Process and fulfill medicine orders</p>
        </Link>
        <Link href="/medicines" className="card">
          <h2 className="h2">Medicine Inventory</h2>
          <p className="text-secondary">Manage medicine stock and availability</p>
        </Link>
        <Link href="/profile" className="card">
          <h2 className="h2">My Profile</h2>
          <p className="text-secondary">Manage your pharmacy information</p>
        </Link>
      </div>
    </div>
  );
} 