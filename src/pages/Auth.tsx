import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignIn, setIsSignIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for the password reset link.",
      });

      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
        setResetEmail("");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has completed skin profile
        const { data: profile } = await supabase
          .from("skin_profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .single();

        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });

        if (profile) {
          navigate("/");
        } else {
          navigate("/skin-profile-setup");
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 12) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 12 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Welcome! Let's set up your skin profile.",
        });
        navigate("/skin-profile-setup");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-lg p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              {showForgotPassword ? "Reset your password" : isSignIn ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
              {showForgotPassword ? (
                <button 
                  onClick={() => setShowForgotPassword(false)}
                  className="text-primary hover:underline"
                >
                  Back to {isSignIn ? "sign in" : "sign up"}
                </button>
              ) : (
                <>
                  {isSignIn ? "Don't have an account? " : "Or "}
                  <button
                    onClick={() => setIsSignIn(!isSignIn)}
                    className="text-primary hover:underline"
                  >
                    {isSignIn ? "Create an account" : "sign in to your account"}
                  </button>
                </>
              )}
            </p>
            
            {showForgotPassword ? (
              <form className="space-y-4" onSubmit={handlePasswordReset}>
                {resetSent ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-sage mb-2">✓ Reset link sent!</p>
                    <p className="text-xs text-muted-foreground">Check your email for the password reset link.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="reset-email">Email address</Label>
                      <Input 
                        id="reset-email" 
                        type="email" 
                        placeholder="Enter your email"
                        className="mt-1.5"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        We'll send you a link to reset your password.
                      </p>
                    </div>
                    
                    <Button className="w-full" size="lg" type="submit">
                      Send Reset Link
                    </Button>
                  </>
                )}
              </form>
            ) : (
              <form className="space-y-4" onSubmit={isSignIn ? handleSignIn : handleSignup}>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
                <div>
                  <Label htmlFor="password">Password*</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    className="mt-1.5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={isSignIn ? 1 : 12}
                    disabled={isLoading}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    {!isSignIn && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Your password must contain:</p>
                        <p className="text-xs text-muted-foreground">• At least 12 characters</p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className={`text-xs text-primary hover:underline whitespace-nowrap ${isSignIn ? '' : 'ml-auto'}`}
                    >
                      Forgot Details?
                    </button>
                  </div>
                </div>
                
                <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                  {isLoading ? (isSignIn ? "Signing In..." : "Creating Account...") : (isSignIn ? "Sign In" : "Continue")}
                </Button>
              </form>
            )}
            
            <div className="my-6">
              <Separator />
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground -mt-3">or</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full" size="lg">
                Sign Up with Google
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Sign Up with Facebook
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Sign Up with Apple
              </Button>
            </div>
            
            <p className="text-center text-xs text-muted-foreground mt-6">
              By logging in, you agree to Purity{" "}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policies</Link>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
