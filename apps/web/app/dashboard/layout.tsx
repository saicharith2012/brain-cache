export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-18 relative pl-64">
      {children}
    </div>
  );
}
