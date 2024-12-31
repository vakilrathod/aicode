import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="bg-brand antialiased">
      <div className="isolate">
        <div className="fixed inset-0 -z-10 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat opacity-30" />
        <div className="relative flex min-h-screen flex-col items-center justify-between py-32">
          <Header />
          {children}
          <Footer />
        </div>
      </div>
    </body>
  );
}
