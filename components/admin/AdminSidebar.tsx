"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Upload,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Image as ImageIcon,
  BarChart3,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/frames", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Customers", icon: Users },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo / Brand */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b",
        collapsed && "justify-center px-2"
      )}>
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          F
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg">FrameKart</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t p-4 space-y-2">
        {!collapsed && (
          <>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col fixed left-0 top-0 h-screen border-r bg-background transition-all duration-300 z-30",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background flex items-center justify-center hover:bg-muted"
        >
          {collapsed ? "→" : "←"}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background z-50 lg:hidden flex flex-col">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background z-20 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            F
          </div>
          <span className="font-bold">FrameKart Admin</span>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
