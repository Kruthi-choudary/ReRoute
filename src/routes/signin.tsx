import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, AuthHeading, GoogleButton, Divider, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — ReRoute AI" },
      { name: "description", content: "Sign in to ReRoute AI and let your autonomous travel concierge monitor flights and recover disrupted journeys." },
      { property: "og:title", content: "Sign In — ReRoute AI" },
      { property: "og:description", content: "Sign in once. We monitor every flight and recover your journey automatically." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <AuthHeading title={<>Welcome Back <span aria-hidden>👋</span></>} subtitle="Sign in to continue your journey." />

      <GoogleButton label="Continue with Google" onClick={() => navigate({ to: "/dashboard" })} />
      <Divider />

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
      >
        <Field label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          hint={
            <button type="button" className="text-[12px] font-medium text-primary transition-opacity hover:opacity-75">
              Forgot password?
            </button>
          }
        />
        <div className="pt-2">
          <PrimaryButton type="submit">Sign In</PrimaryButton>
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
