export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-18 relative">
      {children}
    </div>
  );
}
