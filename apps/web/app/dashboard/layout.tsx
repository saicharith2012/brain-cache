export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16 pl-64 relative">
      {children}
    </div>
  );
}
