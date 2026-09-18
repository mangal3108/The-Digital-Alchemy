"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  FileText,
  Gauge,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Package,
  Search,
  Settings,
  Shuffle,
  Type,
  Users,
  ScrollText,
  HelpCircle,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo";
import { ROLE_LABELS, type Permission, type Role } from "@/lib/rbac";
import { logoutAction } from "@/app/admin/login/actions";

interface NavEntry {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: Permission;
}

const NAV: { group: string; items: NavEntry[] }[] = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: "content.view",
      },
      {
        label: "Leads",
        href: "/admin/leads",
        icon: Inbox,
        permission: "leads.view",
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        label: "Projects",
        href: "/admin/projects",
        icon: Briefcase,
        permission: "projects.manage",
      },
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: "products.manage",
      },
      {
        label: "Insights",
        href: "/admin/posts",
        icon: FileText,
        permission: "posts.manage",
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
        permission: "testimonials.manage",
      },
      {
        label: "Clients",
        href: "/admin/clients",
        icon: Building2,
        permission: "clients.manage",
      },
      {
        label: "Team",
        href: "/admin/team",
        icon: Users,
        permission: "team.manage",
      },
      {
        label: "FAQs",
        href: "/admin/faqs",
        icon: HelpCircle,
        permission: "faqs.manage",
      },
      {
        label: "Careers",
        href: "/admin/careers",
        icon: Briefcase,
        permission: "careers.manage",
      },
      {
        label: "Page copy",
        href: "/admin/content",
        icon: Type,
        permission: "content.edit",
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: ImageIcon,
        permission: "media.upload",
      },
    ],
  },
  {
    group: "Marketing",
    items: [
      {
        label: "Metrics",
        href: "/admin/metrics",
        icon: Gauge,
        permission: "metrics.manage",
      },
      {
        label: "SEO",
        href: "/admin/seo",
        icon: Search,
        permission: "seo.manage",
      },
      {
        label: "Redirects",
        href: "/admin/redirects",
        icon: Shuffle,
        permission: "redirects.manage",
      },
    ],
  },
  {
    group: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        permission: "settings.manage",
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
        permission: "users.manage",
      },
      {
        label: "Audit log",
        href: "/admin/audit",
        icon: ScrollText,
        permission: "audit.view",
      },
    ],
  },
];

export function AdminShell({
  user,
  permissions,
  children,
}: {
  user: { name: string; email: string; role: Role };
  permissions: Permission[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const allowed = React.useMemo(() => new Set(permissions), [permissions]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const groups = NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => allowed.has(item.permission)),
  })).filter((group) => group.items.length);

  return (
    <div className="flex min-h-dvh">
      {/* ---- Sidebar ---- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-modal w-64 shrink-0 overflow-y-auto border-r border-hairline bg-surface",
          "transition-transform duration-[var(--duration-standard)] ease-standard lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-hairline px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <LogoMark className="h-6 w-auto" />
            <span className="text-[0.875rem] font-semibold tracking-[-0.02em] text-ink">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="inline-flex size-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:hidden"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <nav aria-label="Admin" className="px-3 py-4">
          {groups.map((group) => (
            <div key={group.group} className="mb-5 last:mb-0">
              <p className="px-2 pb-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-9 items-center gap-2.5 rounded-md px-2 text-[0.875rem]",
                          "transition-colors duration-[var(--duration-fast)]",
                          "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
                          active
                            ? "bg-accent-soft font-medium text-accent-text"
                            : "text-ink-muted hover:bg-surface-2 hover:text-ink",
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          className={cn(
                            "size-4 shrink-0",
                            active ? "text-accent" : "text-ink-subtle",
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sticky bottom-0 border-t border-hairline bg-surface p-3">
          <div className="rounded-md bg-surface-2 px-3 py-2.5">
            <p className="truncate text-[0.8125rem] font-medium text-ink">
              {user.name}
            </p>
            <p className="truncate text-[0.75rem] text-ink-subtle">
              {user.email}
            </p>
            <p className="mt-1 inline-flex rounded-full bg-surface px-2 py-0.5 text-[0.6875rem] font-medium text-ink-muted">
              {ROLE_LABELS[user.role]}
            </p>
          </div>

          <div className="mt-2 flex gap-1.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline px-2 text-[0.75rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              View site
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
            <form action={logoutAction} className="flex-1">
              <button
                type="submit"
                className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-md border border-hairline px-2 text-[0.75rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <LogOut aria-hidden="true" className="size-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-overlay bg-ink-900/40 lg:hidden"
        />
      ) : null}

      {/* ---- Content ---- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-sticky flex h-14 items-center gap-3 border-b border-hairline bg-canvas/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-9 items-center justify-center rounded-md text-ink hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Menu aria-hidden="true" className="size-4" />
          </button>
          <span className="text-[0.875rem] font-semibold text-ink">Admin</span>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
