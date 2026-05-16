"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { cn } from "@/lib/utils";
import { signupAction } from "@/server/actions/auth/signup.action";

type Role = "USER" | "BUSINESS";

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !email) return;

    setError("");
    setIsLoading(true);

    const result = await signupAction({ email, role });

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (role === "BUSINESS") {
      setPendingApproval(true);
      setIsLoading(false);
      return;
    }

    // For USER role, trigger magic link sign-in
    await signIn("email", {
      email,
      callbackUrl: "/",
      redirect: true,
    });
  }

  if (pendingApproval) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold">Account Created</h1>
          <p className="text-muted-foreground">
            Your business account has been created and is pending admin approval.
            You will receive an email once your account is approved.
          </p>
          <Button
            variant="outline"
            onClick={() => signIn("email", { email, callbackUrl: "/", redirect: true })}
          >
            Sign in with magic link anyway
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Навън</h1>
          <p className="mt-2 text-muted-foreground">
            Открий най-доброто във Варна
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("USER")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-6 transition-colors",
              role === "USER"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <span className="text-2xl">👤</span>
            <span className="font-medium">User</span>
            <span className="text-xs text-muted-foreground text-center">
              Discover events and connect with friends
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("BUSINESS")}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-6 transition-colors",
              role === "BUSINESS"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <span className="text-2xl">🏢</span>
            <span className="font-medium">Business</span>
            <span className="text-xs text-muted-foreground text-center">
              Create and promote events
            </span>
          </button>
        </div>

        {role === "BUSINESS" && (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Business accounts require admin approval before you can post events.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error || undefined}
            required
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!role || !email}
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary underline">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
