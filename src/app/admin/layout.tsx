import type { Metadata } from "next";

/**
 * Bare admin shell.
 *
 * Deliberately outside the (site) route group: the admin panel must not
 * inherit the marketing site's chrome, hero components or decorative styling.
 * The authenticated chrome lives in (dashboard)/layout.tsx so that the login
 * page can sit under /admin without being caught by its own auth guard.
 */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
}
