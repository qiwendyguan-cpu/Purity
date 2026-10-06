import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps = {}) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        {/* Info Banner */}
        <div className="py-2 text-center text-sm text-muted-foreground">
          Purity is an independent, community-driven platform. We may earn a commission when you buy through our links. We are not the seller.
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-4xl font-bold text-primary tracking-wide">
            Purity
          </Link>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/auth">Create Account</Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/profile">
                <User className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Tagline */}
        <div className="text-center pb-4">
          <p className="text-sm text-muted-foreground font-medium">Your peace of mind, purified.</p>
          <p className="text-xs text-muted-foreground">A seamless one-stop shopping experience.</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex justify-center gap-8 pb-4 text-sm">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            All Products
          </Link>
          <Link to="/how-it-works" className="text-foreground hover:text-primary transition-colors">
            How this works?
          </Link>
          <Link to="/blogs" className="text-foreground hover:text-primary transition-colors">
            Blogs
          </Link>
        </nav>
      </div>
    </header>
  );
};
