"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">خطایی رخ داد</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary-500 text-white rounded"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
