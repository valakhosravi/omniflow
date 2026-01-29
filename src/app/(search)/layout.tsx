import Footer from "@/components/search/Footer";
import Header from "@/components/search/Header";

export const metadata = {
  title: "PECCO | خانه",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <img
        src="/pictures/bg.webp"
        alt="Dashboard Background"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />
      <div className="relative z-10 w-full h-full flex flex-col justify-between items-center bg-none py-[16px] px-[48px]">
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}
