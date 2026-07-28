import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout, AuthHeading, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth, takeRedirect } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ReRoute AI" },
      { name: "description", content: "Sign in to ReRoute AI and let your autonomous travel companion monitor flights, detect disruptions and recover your itinerary." },
      { property: "og:title", content: "Sign In — ReRoute AI" },
      { property: "og:description", content: "Sign in once. We monitor every flight and recover your journey automatically." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: takeRedirect(), replace: true });
  }, [session, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error((data as { detail?: string }).detail ?? "Sign in failed.");
        return;
      }
      setSession((data as { token: string; id: number; email: string; name: string }).token, {
        id: (data as { id: number }).id,
        email: (data as { email: string }).email,
        name: (data as { name: string }).name,
      });
      navigate({ to: takeRedirect(), replace: true });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <AuthHeading title="Sign In" subtitle="Continue your journey." />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="pt-2">
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary transition-opacity hover:opacity-75">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}
