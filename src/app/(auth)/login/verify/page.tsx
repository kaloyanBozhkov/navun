export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="mt-4 text-gray-600">
        A sign-in link has been sent to your email address.
      </p>
      <a href="/login" className="mt-8 text-sm underline">
        Back to login
      </a>
    </main>
  );
}
