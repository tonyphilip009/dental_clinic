export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center py-12" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-light border-t-brand" />
      <p className="mt-3 text-gray-500">{message}</p>
    </div>
  );
}