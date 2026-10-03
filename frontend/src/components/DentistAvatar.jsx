export default function DentistAvatar({
  photo,
  name,
  size = "h-14 w-14",
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }

  const initials = name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-brand-light font-bold text-brand-dark`}
    >
      {initials}
    </div>
  );
}