export default function EmptyState({
  icon = "🦷",
  title,
  message,
}) {
  return (
    <div className="mx-auto max-w-lg rounded-xl bg-white p-10 text-center shadow-md">
      <p className="text-5xl">{icon}</p>

      <h2 className="mt-4 text-xl font-semibold text-brand-dark">
        {title}
      </h2>

      {message && (
        <p className="mt-2 text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}