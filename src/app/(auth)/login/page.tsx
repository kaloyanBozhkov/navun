"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("email", {
        email,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to send magic link. Please try again.");
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            A sign-in link has been sent to <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in your email to sign in. The link expires in 5 minutes.
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setEmailSent(false);
              setEmail("");
            }}
          >
            Use a different email
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive a magic link
          </p>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-4">
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
            disabled={!email}
          >
            Send Magic Link
          </Button>
        </form>

        {process.env.NODE_ENV === "development" && (
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => signIn("dev-login", { email: "dev@navun.bg", callbackUrl: "/" })}
            >
              Dev Quick Login
            </Button>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-primary underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
