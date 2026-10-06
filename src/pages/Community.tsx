import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Share2 } from "lucide-react";

const Community = () => {
  const posts = [
    {
      id: 1,
      author: "Sarah M.",
      initials: "SM",
      time: "2 hours ago",
      content: "Just tried the CeraVe Hydrating Cleanser and my skin has never felt better! Perfect for my sensitive, acne-prone skin. 10/10 recommend!",
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      author: "Emily R.",
      initials: "ER",
      time: "5 hours ago",
      content: "Looking for recommendations: What's the best sunscreen for oily skin that doesn't leave a white cast?",
      likes: 15,
      comments: 12
    },
    {
      id: 3,
      author: "Jessica L.",
      initials: "JL",
      time: "1 day ago",
      content: "My morning routine: Gentle cleanser → Niacinamide serum → Moisturizer → SPF. Simple and effective for managing acne!",
      likes: 42,
      comments: 18
    },
    {
      id: 4,
      author: "Amanda K.",
      initials: "AK",
      time: "2 days ago",
      content: "PSA: Always patch test new products! Learned this the hard way. What's your patch testing routine?",
      likes: 31,
      comments: 9
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Community</h1>
            <p className="text-muted-foreground">
              Connect with others on their journey to find safe, effective beauty products
            </p>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <textarea 
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Share your thoughts, ask questions, or share your experience..."
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button>Post</Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{post.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{post.author}</CardTitle>
                        <p className="text-xs text-muted-foreground">{post.time}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Community;
