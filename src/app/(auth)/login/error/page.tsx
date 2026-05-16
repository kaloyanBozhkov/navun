"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "Access denied. You do not have permission to sign in.",
    Verification: "The sign-in link has expired or has already been used.",
    Default: "An error occurred during authentication.",
  };

  const message = error ? (errorMessages[error] ?? errorMessages.Default) : errorMessages.Default;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="mt-4 text-gray-600">{message}</p>
      <a href="/login" className="mt-8 text-sm underline">
        Back to login
      </a>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
