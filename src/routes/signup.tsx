import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout, AuthHeading, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { useAuth, takeRedirect } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

const COUNTRIES = [
  "United States", "United Kingdom", "United Arab Emirates", "Canada", "India",
  "Germany", "France", "Netherlands", "Singapore", "Japan", "Australia", "Brazil",
];

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — ReRoute AI" },
      { name: "description", content: "Create your ReRoute AI account for autonomous flight monitoring, instant rebooking and hotel recovery." },
      { property: "og:title", content: "Create Account — ReRoute AI" },
      { property: "og:description", content: "Start your smarter travel experience with autonomous disruption recovery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const { session, setSession } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "", country: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: takeRedirect(), replace: true });
  }, [session, navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agree) {
      toast.error("Please accept the Terms and Privacy Policy.");
      return;
    }
    setBusy(true);
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password, name: form.fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error((data as { detail?: string }).detail ?? "Registration failed.");
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
    <AuthLayout
      aside={{
        title: "Travel Smarter with ReRoute AI",
        subtitle:
          "Join travelers who never manage a disruption alone. We watch every flight, predict delays, and rebuild your itinerary automatically.",
      }}
    >
      <AuthHeading title="Create Your Account" subtitle="Start your smarter travel experience." />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Full Name" autoComplete="name" placeholder="Alex Morgan" required value={form.fullName} onChange={set("fullName")} />
        <Field label="Email" type="email" autoComplete="email" placeholder="you@example.com" required value={form.email} onChange={set("email")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" type="password" autoComplete="new-password" placeholder="••••••••" required minLength={6} value={form.password} onChange={set("password")} />
          <Field label="Confirm Password" type="password" autoComplete="new-password" placeholder="••••••••" required minLength={6} value={form.confirm} onChange={set("confirm")} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="country" className="text-[13px] font-medium text-foreground">Country</label>
          <select
            id="country"
            required
            value={form.country}
            onChange={set("country")}
            className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-all duration-200 hover:border-foreground/20 focus:border-primary focus:ring-4 focus:ring-primary/12"
          >
            <option value="" disabled>Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-3 pt-1 text-[13px] text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-[var(--primary)]"
          />
          <span>
            I agree to the <span className="font-medium text-foreground">Terms</span> and{" "}
            <span className="font-medium text-foreground">Privacy Policy</span>
          </span>
        </label>

        <div className="pt-1">
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? "Creating account…" : "Create Account"}
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary transition-opacity hover:opacity-75">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
