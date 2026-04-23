import Header from "@/components/common/AppHeader/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full h-screen ">
      <div className="print:hidden">
        <Header />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
