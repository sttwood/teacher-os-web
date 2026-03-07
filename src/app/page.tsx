import Link from "next/link";

async function getHealth() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const res = await fetch(`${baseUrl}/health`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch health");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return { message: "backend unavailable" };
  }
}

export default async function HomePage() {
  const health = await getHealth();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Teacher OS</h1>
      <p className="mt-4">Backend status: {health.message}</p>
      <div className="mt-4 flex gap-4">
        <Link href="/login" className="underline">
          Login
        </Link>
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </main>
  );
}
