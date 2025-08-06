import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "PATIENT") {
    redirect("/dashboard/patient");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/appointments" className="card">
          <h2 className="h2">Book Appointments</h2>
          <p className="text-secondary">Schedule appointments with hospitals</p>
        </Link>
        <Link href="/medicines" className="card">
          <h2 className="h2">Order Medicines</h2>
          <p className="text-secondary">Browse and order medicines</p>
        </Link>
        <Link href="/bills" className="card">
          <h2 className="h2">View Bills</h2>
          <p className="text-secondary">Check your medical bills</p>
        </Link>
        <Link href="/profile" className="card">
          <h2 className="h2">My Profile</h2>
          <p className="text-secondary">Manage your health information</p>
        </Link>
      </div>
    </div>
  );
} 