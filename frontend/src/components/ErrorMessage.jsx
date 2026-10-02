export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
    >
      <p className="text-red-700">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-brand px-5 py-2 font-semibold text-white transition hover:bg-brand-dark"
        >
          Try again
        </button>
      )}
    </div>
  );
}