import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  LogOut,
  HeadphonesIcon,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProfileDropdownProps {
  onCustomerServiceClick: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  onCustomerServiceClick,
  onLogout,
}: ProfileDropdownProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load Firestore profile once when user is available
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || user.email || "",
        });
      } else {
        // Fallback to auth info
        setProfile({
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
        });
      }
    })();
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
    : "–";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 group"
      >
        <span className="text-white text-sm font-medium">{initials}</span>
        {/* <ChevronDown
          className={`w-3 h-3 text-white/70 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        /> */}
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-64 shadow-xl border border-slate-200 z-50">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-4 border-b bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{initials}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {profile?.firstName} {profile?.lastName}
                  </h4>
                  <p className="text-sm text-slate-600">{profile?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="py-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50"
              >
                <User className="w-5 h-5 mr-3 text-slate-500" />
                <div>
                  <p className="font-medium">Edit Profile</p>
                  <p className="text-xs text-slate-500">Manage your account</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onCustomerServiceClick();
                }}
                className="w-full flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50"
              >
                <HeadphonesIcon className="w-5 h-5 mr-3 text-slate-500" />
                <div>
                  <p className="font-medium">Customer Service</p>
                  <p className="text-xs text-slate-500">Help & support</p>
                </div>
              </button>

              <div className="border-t mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Logout</p>
                    <p className="text-xs text-red-500">Sign out</p>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}