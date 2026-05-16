"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { cn } from "@/lib/utils";
import { signupAction } from "@/server/actions/auth/signup.action";
import { User, Store } from "lucide-react";

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
          <h1 className="text-2xl font-bold">Акаунтът е създаден</h1>
          <p className="text-muted-foreground">
            Бизнес акаунтът ти е създаден и чака одобрение от администратор.
            Ще получиш имейл когато акаунтът ти бъде одобрен.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              signIn("email", { email, callbackUrl: "/", redirect: true })
            }
          >
            Влез с magic link
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen">
      {/* Left hero column - desktop only */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center bg-slate-900 p-12 text-white">
        <h1 className="text-4xl font-bold">
          Открий
          <br />
          Варна отново
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Събития, места и преживявания — всичко на едно място.
        </p>
        <div className="mt-8 h-32 w-32 rounded-full bg-blue-500/20" />
      </div>

      {/* Right form column */}
      <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600">Навън</h1>
            <p className="mt-2 text-muted-foreground">
              Открий най-доброто във Варна
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Избери тип акаунт
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border p-6 transition-colors cursor-pointer",
                role === "USER"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-border hover:border-blue-300"
              )}
              onClick={() => setRole("USER")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <User className="h-6 w-6" />
              </div>
              <span className="font-semibold">Потребител</span>
              <span className="text-center text-xs text-muted-foreground">
                Откривай събития, маркирай интерес и следи какво правят
                приятелите ти
              </span>
              <Button
                type="button"
                className="mt-auto w-full bg-blue-600 hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setRole("USER");
                }}
              >
                Регистрация
              </Button>
            </div>

            <div
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border p-6 transition-colors cursor-pointer",
                role === "BUSINESS"
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950"
                  : "border-border hover:border-orange-300"
              )}
              onClick={() => setRole("BUSINESS")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Store className="h-6 w-6" />
              </div>
              <span className="font-semibold">Бизнес</span>
              <span className="text-center text-xs text-muted-foreground">
                Публикувай събития и достигни до хиляди потребители във Варна
              </span>
              <Button
                type="button"
                variant="outline"
                className="mt-auto w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setRole("BUSINESS");
                }}
              >
                Регистрация
              </Button>
            </div>
          </div>

          {role === "BUSINESS" && (
            <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Бизнес акаунтите изискват одобрение от администратор преди да
              можеш да публикуваш събития.
            </p>
          )}

          {role && (
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
                Регистрация
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Вече имаш акаунт?{" "}
            <a href="/login" className="text-primary underline">
              Влез
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
