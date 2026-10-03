const STEPS = ["Service", "Dentist & Time", "Your Details", "Verify"];

export default function BookingSteps({ current }) {
  return (
    <ol className="mb-10 flex items-center justify-center gap-3 text-sm sm:gap-6">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const done = number < current;
        const active = number === current;

        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                done
                  ? "bg-brand text-white"
                  : active
                  ? "bg-brand-dark text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : number}
            </span>

            <span
              className={`${active ? "inline" : "hidden"} font-medium sm:inline ${
                active ? "text-brand-dark" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}