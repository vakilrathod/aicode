import type { Metadata } from "next";
import "./globals.css";

let title = "VizionCoder Alpha – AI Code Generator";
let description = "Generate your next app with VizionCoder";
let url = "https://llamacoder.io/";
let ogimage = "https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/33520e9b-43ac-4f77-865a-93341fc61526/Portrait_Perfect_a_beautiful_modern_city_skyline_at_dusk_3.jpg";
let sitename = "vizioncoder.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {children}
    </html>
  );
}
