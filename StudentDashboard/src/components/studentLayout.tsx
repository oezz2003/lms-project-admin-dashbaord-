import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Clock, Trophy, TrendingUp, Gift, Coins, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProfileDropdown from "./ProfileDropdown";
import CustomerServiceModal from "./CustomerServiceModal";

// useAuth hook from your lib (adjust path if different)
import { useAuth } from "@/lib/useAuth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);

  // grab logout (and optionally user/loading) from your auth hook
  const { logout, user, loading } = useAuth() as {
    logout?: () => Promise<void>;
    user?: any;
    loading?: boolean;
  };

  // Mock user points - in a real app this would come from your state management/API
  const userPoints = 2850;

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      } else {
        // fallback cleanup if logout isn't provided (shouldn't normally run)
        console.warn("useAuth() does not expose logout() — verify your hook implementation.");
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch (e) {
          /* ignore */
        }
      }

      // Redirect to login after logout
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
      // Show a toast/notification here if you have one
    }
  };

  const handleCustomerService = () => {
    setIsCustomerServiceOpen(true);
  };

  const navItems = [
    {
      href: "/student-dashboard",
      label: "Dashboard",
      icon: BookOpen,
    },
    {
      href: "/progress",
      label: "Progress",
      icon: TrendingUp,
    },
    {
      href: "/store",
      label: "Store",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <img
                src="https://smartonlinelearningedu.com/static/media/WhatsApp%20Image%202025-05-26%20at%2000.38.02_5277dbf4.f388d82bb2a41fa81dbf.jpg"
                alt="Logo"
                className="h-12 w-12 object-cover rounded-full"
              />
              <span className="hidden font-semibold text-lg sm:inline-block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Smart learning academy
              </span>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.href;

                  return (
                    <Link key={item.href} to={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Points Display */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full px-3 py-2">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">{userPoints.toLocaleString()}</span>
                <span className="text-xs text-yellow-600">points</span>
              </div>

              {/* Hidden on mobile, shown on larger screens */}
              <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-success" />
                  <span>2 Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>3 In Progress</span>
                </div>
              </div>

              {/* User Profile Dropdown */}
              <ProfileDropdown onCustomerServiceClick={handleCustomerService} onLogout={handleLogout} />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-3">
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;

                return (
                  <Link key={item.href} to={item.href} className="flex-1">
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Customer Service Modal */}
      <CustomerServiceModal isOpen={isCustomerServiceOpen} onClose={() => setIsCustomerServiceOpen(false)} />
    </div>
  );
}
