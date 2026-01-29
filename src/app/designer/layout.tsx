export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" lang="en">
      {children}
    </div>
  );
}
