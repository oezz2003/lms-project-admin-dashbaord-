import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { Lock, Mail } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";

export function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect
  if (user) {
    navigate("/student-dashboard", { replace: true });
    return null;
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/student-dashboard", { replace: true });
    } catch (error: any) {
      const msg = "Wrong Password Try Again"
      window.alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto p-8 rounded-xl border bg-background shadow-lg">
          <div className="flex flex-col space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                {t("Login to your account")}
              </h1>
            </div>

            <form className="space-y-4" onSubmit={login}>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("student@example.com")}
                    className="pl-10 border border-black"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("password")}
                    className="pl-10 border border-black"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t("Forgot Password")}
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("Submitting") : t("Login")}
              </Button>
            </form>



            <p className="px-8 text-center text-sm text-muted-foreground">
              
              <Link
                to="/SignUp"
                className="text-sm text-primary hover:underline"
              >
                {t("Sign Up")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}