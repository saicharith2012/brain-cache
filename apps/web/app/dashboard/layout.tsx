import Navbar from "../../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen pt-14 relative">
      <Navbar />
      {children}
    </div>
  );
}
