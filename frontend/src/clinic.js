
export const clinic = {
  name: "House of Dental",
  tagline: "Gentle, modern dental care for the whole family.",
  address: "123 Main Road, Kochi, Kerala 682001",
  phone: "+91 98765 43210",
  email: "hello@houseofdental.example",
  hours: [
    { days: "Monday to Saturday", time: "9:00 AM - 6:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
};

export const phoneHref = `tel:${clinic.phone.replace(/[^\d+]/g, "")}`;
export const emailHref = `mailto:${clinic.email}`;
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  clinic.address
)}`;
