export default function ContainerTop({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-secondary-0 rounded-4xl p-10 h-full flex-grow flex flex-col overflow-y-auto">
      {children}
    </div>
  );
}
