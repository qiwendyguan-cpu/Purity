import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Acne-Prone Skin: A Complete Guide",
      excerpt: "Learn about the causes of acne-prone skin and how to choose the right products for your skin type.",
      category: "Skincare Tips",
      date: "Nov 15, 2025",
      readTime: "8 min read",
      image: "bg-gradient-to-br from-primary/20 to-accent/20"
    },
    {
      id: 2,
      title: "The Science Behind Clean Beauty Products",
      excerpt: "Discover what makes a beauty product 'clean' and why it matters for your skin health.",
      category: "Education",
      date: "Nov 12, 2025",
      readTime: "6 min read",
      image: "bg-gradient-to-br from-secondary/40 to-primary/20"
    },
    {
      id: 3,
      title: "Building Your Perfect Morning Skincare Routine",
      excerpt: "Step-by-step guide to creating an effective morning routine for acne-prone skin.",
      category: "Routines",
      date: "Nov 8, 2025",
      readTime: "10 min read",
      image: "bg-gradient-to-br from-accent/20 to-secondary/30"
    },
    {
      id: 4,
      title: "Ingredient Spotlight: Niacinamide",
      excerpt: "Everything you need to know about niacinamide and how it can transform your skin.",
      category: "Ingredients",
      date: "Nov 5, 2025",
      readTime: "7 min read",
      image: "bg-gradient-to-br from-primary/30 to-accent/10"
    },
    {
      id: 5,
      title: "Common Skincare Mistakes to Avoid",
      excerpt: "Learn about the most common mistakes people make with their skincare and how to fix them.",
      category: "Tips & Tricks",
      date: "Nov 1, 2025",
      readTime: "5 min read",
      image: "bg-gradient-to-br from-accent/30 to-primary/10"
    },
    {
      id: 6,
      title: "How to Read Product Labels Like a Pro",
      excerpt: "Decode ingredient lists and learn what to look for (and avoid) in your beauty products.",
      category: "Education",
      date: "Oct 28, 2025",
      readTime: "9 min read",
      image: "bg-gradient-to-br from-secondary/30 to-accent/20"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Blogs</h1>
          <p className="text-muted-foreground">
            Expert advice, tips, and insights for your skincare journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`h-48 ${post.image}`}></div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blogs;
