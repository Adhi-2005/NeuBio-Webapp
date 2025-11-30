import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");
  const { setUser } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    setError("");
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const result = await response.json();
      setUser(result.user);
      setLocation("/status");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="BackgroundLogin.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-12">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-white uppercase leading-none tracking-tight mb-4">
            Leave<br />Memory<br />Lapses<br />Behind<br />For Good
          </h1>
          <p className="text-white/80 font-medium">
            By continuing, you agree to our Terms and Privacy :)
          </p>
        </div>

        <div className="bg-background/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center uppercase">Welcome Back</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="h-12 rounded-xl bg-muted/50 border-0"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="h-12 rounded-xl bg-muted/50 border-0"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link href="/forgot-password">
                  <a className="text-sm text-muted-foreground hover:text-foreground font-medium" data-testid="link-forgot-password">
                    Forgot password?
                  </a>
                </Link>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-full text-lg font-bold uppercase tracking-wide"
                disabled={form.formState.isSubmitting}
                data-testid="button-login"
              >
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link href="/register">
                  <Button variant="secondary" className="w-full h-14 rounded-full text-lg font-bold uppercase tracking-wide bg-muted text-foreground hover:bg-muted/80">
                    Create Account
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
