
export const clinic = {
  name: "House of Dental",
  tagline: "Gentle, modern dental care for the whole family.",

  // Replace these with the clinic's verified details before publishing.
  address: "UPDATE WITH REAL CLINIC ADDRESS",
  phone: "UPDATE WITH REAL PHONE NUMBER",
  email: "UPDATE WITH REAL EMAIL ADDRESS",

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

// Only add statistics after verifying the clinic's actual figures.
export const stats = [];
