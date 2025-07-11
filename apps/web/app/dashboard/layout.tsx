import Navbar from "../../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-14 relative pl-64">
      <Navbar />
      {children}
    </div>
  );
}
