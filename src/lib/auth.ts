import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
// import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/lib/db";
import { setLastMagicLink } from "@/lib/dev-magic-link";
import { sendMagicLinkEmail } from "@/lib/email";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
  providers: [
    // --- Google OAuth (commented out — enable when ready) ---
    // ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    //   ? [
    //       GoogleProvider({
    //         clientId: env.GOOGLE_CLIENT_ID,
    //         clientSecret: env.GOOGLE_CLIENT_SECRET,
    //       }),
    //     ]
    //   : []),

    // --- Email Magic Link ---
    EmailProvider({
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        if (process.env.NODE_ENV === "development") {
          setLastMagicLink(identifier, url);
          console.log("MAGIC LINK:", url);
        }

        if (env.RESEND_API_KEY) {
          await sendMagicLinkEmail(identifier, url);
        }
      },
    }),

    // --- Dev-only Credentials Provider ---
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            id: "dev-login",
            name: "Dev Login",
            credentials: {
              email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;

              const user = await db.user.upsert({
                where: { email: credentials.email },
                update: {},
                create: {
                  email: credentials.email,
                  name: credentials.email.split("@")[0],
                  role: "USER",
                },
              });

              return { id: user.id, email: user.email, name: user.name };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          sub: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
