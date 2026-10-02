function ServiceIcon({ icon, name, size = "text-4xl" }) {
  if (!icon) {
    return <span className={size}>🦷</span>;
  }

  if (icon.startsWith("http") || icon.startsWith("/")) {
    return (
      <img
        src={icon}
        alt={name}
        className="h-12 w-12 object-contain"
      />
    );
  }

  return <span className={size}>{icon}</span>;
}

export default ServiceIcon;