function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 bg-brand-dark py-4 text-center text-white">
      <p>&copy; {year} House of Dental. All rights reserved.</p>
    </footer>
  );
}

export default Footer;