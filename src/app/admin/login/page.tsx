import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { LogoMark } from "@/components/ui/logo";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already signed in? Skip the form.
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-auto" />
          <span className="font-display text-[0.9375rem] font-semibold tracking-[-0.02em] text-ink">
            The Digital Alchemy
          </span>
        </div>

        <h1 className="mt-8 text-[1.5rem] font-semibold tracking-[-0.025em] text-ink">
          Sign in
        </h1>
        <p className="mt-1.5 text-[0.875rem] text-ink-muted">
          Administration for the website content and enquiries.
        </p>

        <div className="mt-7">
          <LoginForm />
        </div>

        <p className="mt-8 text-[0.75rem] leading-relaxed text-ink-subtle">
          This area is protected. Every request is authorised on the server, and
          sign-in attempts are rate limited.
        </p>
      </div>
    </div>
  );
}
