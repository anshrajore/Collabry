import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { NotificationsBell } from "@/components/site/NotificationsBell";
import { useAuth } from "@/providers/AuthProvider";
import { LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-3xl tracking-tight text-gradient">Collabry.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/campaigns" className="hover:text-foreground transition" activeProps={{ className: "text-foreground font-medium" }}>
            Campaigns
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-foreground transition" activeProps={{ className: "text-foreground font-medium" }}>
              Dashboard
            </Link>
          )}
          <a href="/#how" className="hover:text-foreground transition">How it works</a>
          <a href="/#features" className="hover:text-foreground transition">Features</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <NotificationsBell />
              <Link to="/profile/$username" params={{ username: user.id }} className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <UserIcon className="h-4 w-4 mr-1" /> Profile
                </Button>
              </Link>
              <Link to="/dashboard" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="rounded-full">
                <LogOut className="h-4 w-4 mr-1" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="rounded-full">Sign in</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="rounded-full px-5">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
