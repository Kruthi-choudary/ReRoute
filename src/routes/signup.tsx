import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout, AuthHeading, GoogleButton, Divider, Field, PrimaryButton } from "@/components/auth/AuthShell";

const COUNTRIES = ["United States", "United Kingdom", "United Arab Emirates", "India", "Germany", "Singapore", "Japan", "Australia"];

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — ReRoute AI" },
      { name: "description", content: "Create your ReRoute AI account and personalise autonomous flight monitoring, rebooking and hotel recovery." },
      { property: "og:title", content: "Create Account — ReRoute AI" },
      { property: "og:description", content: "Let's personalize your travel experience with autonomous disruption recovery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <AuthHeading title="Create Your Account" subtitle="Let's personalize your travel experience." />

      <GoogleButton label="Continue with Google" onClick={() => navigate({ to: "/dashboard" })} />
      <Divider />

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
      >
        <Field label="Full Name" autoComplete="name" placeholder="Alex Morgan" required />
        <Field label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" type="password" autoComplete="new-password" placeholder="••••••••" required />
          <Field label="Confirm Password" type="password" autoComplete="new-password" placeholder="••••••••" required />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="country" className="text-[13px] font-medium text-foreground">Country</label>
          <select
            id="country"
            required
            defaultValue=""
            className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground outline-none transition-all duration-200 hover:border-foreground/20 focus:border-primary focus:ring-4 focus:ring-primary/12"
          >
            <option value="" disabled>Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <Field label="Phone (Optional)" type="tel" autoComplete="tel" placeholder="+1 555 000 1234" />

        <label className="flex items-start gap-3 pt-1 text-[13px] leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4.5 w-4.5 rounded-md border-border text-primary accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ width: 18, height: 18 }}
          />
          <span>
            I agree to the <a href="#" className="font-medium text-primary hover:opacity-75">Terms &amp; Privacy Policy</a>
          </span>
        </label>

        <div className="pt-2">
          <PrimaryButton type="submit">Create Account</PrimaryButton>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-primary transition-opacity hover:opacity-75">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
