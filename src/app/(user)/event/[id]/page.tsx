export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Event {id}</h1>
      <p className="mt-2 text-gray-600">Event details coming soon</p>
    </main>
  );
}
