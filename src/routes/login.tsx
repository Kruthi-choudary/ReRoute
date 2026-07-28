import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout, AuthHeading, GoogleButton, Divider, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, takeRedirect } from "@/lib/auth";

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
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: takeRedirect(), replace: true });
  }, [session, navigate]);

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error(result.error.message ?? "Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: takeRedirect(), replace: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: takeRedirect(), replace: true });
  }

  async function handleForgot() {
    if (!email) {
      toast.info("Enter your email address first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    toast[error ? "error" : "success"](error ? error.message : "Password reset link sent.");
  }

  return (
    <AuthLayout>
      <AuthHeading title="Sign In" subtitle="Continue your journey." />

      <GoogleButton label="Continue with Google" onClick={handleGoogle} />
      <Divider />

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
          hint={
            <button type="button" onClick={handleForgot} className="text-[12px] font-medium text-primary transition-opacity hover:opacity-75">
              Forgot Password?
            </button>
          }
        />
        <div className="pt-2">
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-primary transition-opacity hover:opacity-75">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}
