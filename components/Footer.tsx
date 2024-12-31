import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-center py-8">
      <p className="text-[var(--secondary-gold)]">
        Made with ❤️ by{" "}
        <a
          href="https://codeium.com"
          target="_blank"
          className="text-[var(--primary-gold)] hover:underline"
        >
          Codeium
        </a>
      </p>
    </footer>
  );
}
