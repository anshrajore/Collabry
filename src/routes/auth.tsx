import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, type AppRole } from "@/providers/AuthProvider";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · Collabry" },
      { name: "description", content: "Sign in or create your Collabry account." },
    ],
  }),
});

const baseSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});
const signupSchema = baseSchema.extend({
  name: z.string().trim().min(2, "Name is required").max(80),
  role: z.enum(["influencer", "brand"]),
});
type SignupValues = z.infer<typeof signupSchema>;

function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [role, setRole] = useState<AppRole>("influencer");
  const [loading, setLoading] = useState(false);

  const schema = mode === "signup" ? signupSchema : baseSchema;
  const form = useForm<SignupValues>({
    resolver: zodResolver(schema as never),
    defaultValues: { name: "", email: "", password: "", role: "influencer" },
  });

  const onSubmit = async (values: SignupValues) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await signUp({
          email: values.email,
          password: values.password,
          name: values.name,
          role,
        });
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Welcome to Collabry!");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await signIn({ email: values.email, password: values.password });
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero bg-grain px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 font-display text-4xl text-gradient">
          Collabry.
        </Link>

        <div className="rounded-3xl border border-border/60 bg-card-luxe p-8 shadow-luxe backdrop-blur">
          <div className="grid grid-cols-2 rounded-full bg-background/60 p-1 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full py-2 text-sm font-medium transition ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h1 className="font-display text-4xl mb-1">
            {mode === "signup" ? "Begin your story" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signup"
              ? "Join Collabry as a creator or brand."
              : "Sign in to your Collabry account."}
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label>I am a</Label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(["influencer", "brand"] as const).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => {
                          setRole(r);
                          form.setValue("role", r);
                        }}
                        className={`rounded-xl border px-4 py-3 text-sm capitalize transition ${
                          role === r
                            ? "border-gold bg-gold/15 text-foreground"
                            : "border-border/60 text-muted-foreground hover:border-border"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@brand.com" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full rounded-full h-11" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            OR
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full rounded-full h-11 bg-background/40"
            onClick={() => toast.info("Google sign-in coming soon")}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .55 4.1 1.6L19 3.7C17.1 1.95 14.7 1 12 1 7.3 1 3.25 3.7 1.3 7.65l3.4 2.65C5.65 7.45 8.6 5 12 5z"/>
              <path fill="#34A853" d="M23 12.25c0-.85-.07-1.45-.22-2.07H12v3.95h6.3c-.13 1.05-.85 2.6-2.45 3.65l3.3 2.55C21.3 18.45 23 15.6 23 12.25z"/>
              <path fill="#FBBC05" d="M4.7 14.3c-.25-.75-.4-1.55-.4-2.35s.15-1.6.4-2.35L1.3 7C.5 8.55 0 10.25 0 12s.5 3.45 1.3 5l3.4-2.7z"/>
              <path fill="#4285F4" d="M12 23c3.25 0 5.95-1.05 7.95-2.85l-3.3-2.55c-.9.6-2.05 1-4.65 1-3.4 0-6.35-2.45-7.3-5.3L1.3 16C3.25 19.95 7.3 23 12 23z"/>
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing you agree to Collabry's Terms & Privacy.
        </p>
      </div>
    </div>
  );
}
