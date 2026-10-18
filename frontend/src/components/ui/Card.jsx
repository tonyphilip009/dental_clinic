
export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-soft ring-1 ring-brand/10 transition duration-300 hover:-translate-y-1 hover:shadow-glow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
