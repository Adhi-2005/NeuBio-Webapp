import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Bluetooth, LogOut, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/status">
              <a className="flex items-center gap-2 font-semibold text-lg hover-elevate px-2 py-1 rounded-lg" data-testid="link-logo">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <span className="hidden sm:inline">HearTrack</span>
              </a>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {/* Journal link hidden for now
              <Link href="/journal">
                <Button
                  variant="ghost"
                  className={isActive("/journal") ? "bg-accent" : ""}
                  data-testid="link-journal"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Journal
                </Button>
              </Link>
              */}
              <Link href="/milestones">
                <Button
                  variant="ghost"
                  className={isActive("/milestones") ? "bg-accent" : ""}
                  data-testid="link-milestones"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Milestones
                </Button>
              </Link>
              <Link href="/device">
                <Button
                  variant="ghost"
                  className={isActive("/device") ? "bg-accent" : ""}
                  data-testid="link-device"
                >
                  <Bluetooth className="w-4 h-4 mr-2" />
                  Device
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        <div className="md:hidden flex gap-2 pb-2 overflow-x-auto">
          {/* Journal link hidden for now
          <Link href="/journal">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${isActive("/journal") ? "bg-accent" : ""}`}
              data-testid="link-journal-mobile"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </Button>
          </Link>
          */}
          <Link href="/milestones">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${isActive("/milestones") ? "bg-accent" : ""}`}
              data-testid="link-milestones-mobile"
            >
              <Star className="w-4 h-4 mr-2" />
              Milestones
            </Button>
          </Link>
          <Link href="/device">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${isActive("/device") ? "bg-accent" : ""}`}
              data-testid="link-device-mobile"
            >
              <Bluetooth className="w-4 h-4 mr-2" />
              Device
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
