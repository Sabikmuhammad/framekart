import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Upload, Tag } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/frames", label: "Frames", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/uploads", label: "Uploads", icon: Upload },
    { href: "/admin/offers", label: "Offers", icon: Tag },
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b lg:border-b-0 lg:border-r bg-muted/40 p-4 lg:w-64 lg:p-6">
        <h2 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold">Admin Panel</h2>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:space-y-2 lg:overflow-visible">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 lg:gap-3 rounded-lg px-3 py-2 text-xs lg:text-sm transition-colors hover:bg-muted whitespace-nowrap"
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
