"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signIn("email", {
      email,
      callbackUrl: "/",
      redirect: false,
    });

    setEmailSent(true);
    setLoading(false);
  };

  if (emailSent) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-4 text-gray-600">
          A sign-in link has been sent to {email}
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-3xl font-bold">Sign in to Навън</h1>

      <form onSubmit={handleMagicLink} className="flex w-full max-w-sm flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="rounded-lg border px-4 py-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>

      {process.env.NODE_ENV === "development" && (
        <button
          onClick={() => signIn("dev-login", { email: "dev@navun.bg", callbackUrl: "/" })}
          className="mt-8 text-sm text-gray-400 underline"
        >
          Dev Quick Login
        </button>
      )}
    </main>
  );
}
