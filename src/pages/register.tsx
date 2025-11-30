import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";

export default function Register() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");
  const { setUser } = useAuth();

  const form = useForm<InsertUser & { retypePassword: string }>({
    resolver: zodResolver(
      insertUserSchema.extend({
        retypePassword: insertUserSchema.shape.password,
      }).refine((data) => data.password === data.retypePassword, {
        message: "Passwords do not match",
        path: ["retypePassword"],
      })
    ),
    defaultValues: {
      email: "",
      password: "",
      retypePassword: "",
      firstName: "",
      lastName: "",
      guardianName: "",
      guardianPhone: "",
    },
  });

  const onSubmit = async (data: InsertUser & { retypePassword: string }) => {
    setError("");
    try {
      const { retypePassword, ...userData } = data;
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const result = await response.json();
      setUser(result.user);
      setLocation("/onboarding");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto p-6">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tight">Create Account</h1>
          <p className="text-muted-foreground font-medium">Start your journey with us</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        className="h-12 rounded-xl bg-muted/50 border-0"
                        data-testid="input-firstName"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        className="h-12 rounded-xl bg-muted/50 border-0"
                        data-testid="input-lastName"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <FormField
              control={form.control}
              name="retypePassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Retype Password"
                      className="h-12 rounded-xl bg-muted/50 border-0"
                      data-testid="input-retypePassword"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Optional: Guardian Information
              </p>
            </div>

            <FormField
              control={form.control}
              name="guardianName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Guardian's Name"
                      className="h-12 rounded-xl bg-muted/50 border-0"
                      data-testid="input-guardianName"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Guardian's Phone"
                      className="h-12 rounded-xl bg-muted/50 border-0"
                      data-testid="input-guardianPhone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 rounded-full text-lg font-bold uppercase tracking-wide mt-4"
              disabled={form.formState.isSubmitting}
              data-testid="button-register"
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Account"}
            </Button>

            <div className="text-center mt-4">
              <Link href="/login">
                <a className="text-muted-foreground hover:text-foreground font-medium" data-testid="link-login">
                  Already have an account? Sign In
                </a>
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
