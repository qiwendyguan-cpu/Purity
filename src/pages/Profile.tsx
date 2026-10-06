import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Settings, Heart, BookmarkCheck, AlertCircle, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("skinProfile");

  const handleLogout = () => {
    navigate("/");
  };

  const favoriteProducts = [
    {
      id: "fav1",
      name: "Cetaphil Gentle Skin Cleanser",
      brand: "Cetaphil",
      price: "$15",
      rating: 4.7,
      reviewCount: 5432,
      image: "cetaphil-cleanser"
    },
    {
      id: "fav2",
      name: "Youth to the People Superfood Cleanser",
      brand: "Youth to the People",
      price: "$36",
      rating: 4.6,
      reviewCount: 3210,
      image: "yttp-cleanser"
    },
    {
      id: "fav3",
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      brand: "Paula's Choice",
      price: "$32",
      rating: 4.8,
      reviewCount: 4521,
      image: "paulas-choice"
    },
    {
      id: "fav4",
      name: "CeraVe Hydrating Cleanser",
      brand: "CeraVe",
      price: "$16",
      rating: 4.7,
      reviewCount: 6789,
      image: "cerave-cleanser"
    },
    {
      id: "fav5",
      name: "Anua Heartleaf 77% Soothing Toner",
      brand: "Anua",
      price: "$18",
      rating: 4.9,
      reviewCount: 3567,
      image: "anua-toner"
    },
    {
      id: "fav6",
      name: "Shiseido Ultimune Power Infusing Concentrate",
      brand: "Shiseido",
      price: "$75",
      rating: 4.8,
      reviewCount: 2890,
      image: "shiseido"
    },
    {
      id: "fav7",
      name: "Estée Lauder Double Wear Foundation",
      brand: "Estée Lauder",
      price: "$52",
      rating: 4.6,
      reviewCount: 8432,
      image: "foundation"
    },
    {
      id: "fav8",
      name: "Charlotte Tilbury Pillow Talk Lipstick",
      brand: "Charlotte Tilbury",
      price: "$35",
      rating: 4.9,
      reviewCount: 4567,
      image: "ct-lipstick"
    },
    {
      id: "fav9",
      name: "Summer Fridays Jet Lag Mask",
      brand: "Summer Fridays",
      price: "$49",
      rating: 4.7,
      reviewCount: 3421,
      image: "face-mask"
    }
  ];

  const wishlistProducts = [
    {
      id: "wish1",
      name: "Physicians Formula Butter Bronzer",
      brand: "Physicians Formula",
      price: "$14",
      rating: 4.8,
      reviewCount: 2543,
      image: "pf-bronzer"
    },
    {
      id: "wish2",
      name: "Maybelline Fit Me Concealer",
      brand: "Maybelline",
      price: "$9",
      rating: 4.4,
      reviewCount: 1234,
      image: "maybelline-concealer"
    },
    {
      id: "wish3",
      name: "MAC Retro Matte Lipstick",
      brand: "MAC",
      price: "$21",
      rating: 4.8,
      reviewCount: 987,
      image: "mac-lipstick"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="space-y-2">
              <h2 className="text-xl font-bold mb-4">Name</h2>
              
              <button
                onClick={() => setActiveTab("favorites")}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === "favorites" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  My favorites
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("skinProfile")}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === "skinProfile" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Skin Profile
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === "wishlist" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="h-4 w-4" />
                  Wishlist
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === "settings" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === "ingredients" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Ingredient Presences
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("contact")}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  activeTab === "contact" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact (email)
                </div>
              </button>
              
              <div className="pt-4 border-t mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === "skinProfile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Skin Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skinDescription">How would you describe your skin?</Label>
                      <Input id="skinDescription" placeholder="e.g., Combination, oily T-zone" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="irritants">Are there specific ingredients that tend to irritate your skin?</Label>
                      <Textarea 
                        id="irritants"
                        placeholder="List any ingredients you avoid (e.g., fragrance, parabens, sulfates)"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personalized">Would you like personalized product recommendations?</Label>
                      <RadioGroup defaultValue="yes">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="rec-yes" />
                          <Label htmlFor="rec-yes" className="font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="rec-no" />
                          <Label htmlFor="rec-no" className="font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pregnant">Are you pregnant or nursing?</Label>
                      <RadioGroup defaultValue="no">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="preg-yes" />
                          <Label htmlFor="preg-yes" className="font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="preg-no" />
                          <Label htmlFor="preg-no" className="font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prescription">Are you currently using prescription skincare or medication?</Label>
                      <Input id="prescription" placeholder="List any prescription products" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="breakouts">How often do you experience breakouts?</Label>
                      <RadioGroup defaultValue="sometimes">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rarely" id="break-rarely" />
                          <Label htmlFor="break-rarely" className="font-normal cursor-pointer">Rarely</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sometimes" id="break-sometimes" />
                          <Label htmlFor="break-sometimes" className="font-normal cursor-pointer">Sometimes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="often" id="break-often" />
                          <Label htmlFor="break-often" className="font-normal cursor-pointer">Often</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="always" id="break-always" />
                          <Label htmlFor="break-always" className="font-normal cursor-pointer">Always</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button>Save Profile</Button>
                    <Button variant="outline">Reset</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "favorites" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducts.map((product) => (
                    <ProductCard key={product.id} {...product} isFavorite={true} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} {...product} isFavorite={false} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "ingredients" && (
              <Card>
                <CardHeader>
                  <CardTitle>Ingredient Presences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Track ingredients you want to avoid or monitor in your beauty products.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="parabens" />
                      <Label htmlFor="parabens" className="font-normal cursor-pointer">Parabens</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sulfates" />
                      <Label htmlFor="sulfates" className="font-normal cursor-pointer">Sulfates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fragrance" />
                      <Label htmlFor="fragrance" className="font-normal cursor-pointer">Fragrance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="alcohol" />
                      <Label htmlFor="alcohol" className="font-normal cursor-pointer">Alcohol</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="essential-oils" />
                      <Label htmlFor="essential-oils" className="font-normal cursor-pointer">Essential Oils</Label>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Label htmlFor="customIngredients">Other Ingredients to Avoid</Label>
                    <Textarea 
                      id="customIngredients"
                      placeholder="Add any other ingredients you want to track or avoid"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <Button className="mt-4">Save Preferences</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "contact" && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Your Email</Label>
                    <Input id="contactEmail" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                    />
                  </div>
                  <Button>Send Message</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
