import { motion } from "framer-motion";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AuthAside } from "./AuthAside";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AuthAside />
      <main className="flex w-full items-center justify-center px-5 py-12 sm:px-8 lg:w-[45%]">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[440px] rounded-[24px] border border-border/70 bg-card p-7 shadow-float sm:p-9"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: ReactNode; subtitle: string }) {
  return (
    <header className="mb-7">
      <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </header>
  );
}

export function GoogleButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.8Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.93l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.29 14.27a7.2 7.2 0 0 1 0-4.54V6.64H1.28a12 12 0 0 0 0 10.72l4.01-3.09Z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.28 6.64l4.01 3.09C6.23 6.86 8.88 4.75 12 4.75Z" />
      </svg>
      {label}
    </button>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-4" role="separator" aria-label="or">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
}

export function Field({ label, hint, id, type = "text", ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? label.toLowerCase().replace(/[^a-z]+/g, "-");

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={inputId} className="text-[13px] font-medium text-foreground">
          {label}
        </label>
        {hint}
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && show ? "text" : type}
          className={cn(
            "h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(15,23,42,0.02)] outline-none transition-all duration-200 placeholder:text-muted-foreground/70",
            "hover:border-foreground/20 focus:border-primary focus:ring-4 focus:ring-primary/12",
            isPassword && "pr-12",
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
              <circle cx="12" cy="12" r="2.6" />
              {!show && <path d="M4 20 20 4" strokeLinecap="round" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function PrimaryButton({ children, ...rest }: InputHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...(rest as object)}
      className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_rgba(37,99,235,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-lift active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {children}
    </button>
  );
}
