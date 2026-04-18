import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/AuthProvider";
import { Navbar } from "@/components/site/Navbar";
import { Loader2, LayoutDashboard, Megaphone, Inbox, User as UserIcon } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grain">
      <Navbar />
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-8 px-4 sm:px-6 py-8">
        <aside className="md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            <SideLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>Dashboard</SideLink>
            <SideLink to="/campaigns" icon={<Megaphone className="h-4 w-4" />}>Campaigns</SideLink>
            <SideLink to="/applications" icon={<Inbox className="h-4 w-4" />}>
              {role === "brand" ? "Applicants" : "My Applications"}
            </SideLink>
            <SideLink to="/profile-setup" icon={<UserIcon className="h-4 w-4" />}>Profile</SideLink>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition whitespace-nowrap"
      activeProps={{ className: "bg-accent text-foreground font-medium" }}
    >
      {icon}
      {children}
    </Link>
  );
}
