import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StudentLayout from "@/components/studentLayout";
import { 
  Gift, 
  Coins, 
  Star, 
  Clock, 
  CheckCircle, 
  Zap,
  Coffee,
  Book,
  Headphones,
  Trophy,
  Gamepad2,
  ShoppingBag
} from "lucide-react";

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: "digital" | "physical" | "course" | "experience";
  icon: any;
  image: string;
  stock: number;
  isLimited: boolean;
  discount?: number;
  originalPoints?: number;
}

const rewards: Reward[] = [
  {
    id: "1",
    title: "Premium Course Access",
    description: "Unlock any premium course for 30 days",
    points: 500,
    category: "course",
    icon: Book,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
    stock: -1,
    isLimited: false,
  },
  {
    id: "2",
    title: "Noise-Cancelling Headphones",
    description: "Sony WH-1000XM4 Wireless Headphones",
    points: 2000,
    originalPoints: 2500,
    discount: 20,
    category: "physical",
    icon: Headphones,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
    stock: 5,
    isLimited: true,
  },
  {
    id: "3",
    title: "Coffee Shop Voucher",
    description: "$25 Starbucks gift card",
    points: 300,
    category: "experience",
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
    stock: 20,
    isLimited: false,
  },
  {
    id: "4",
    title: "Gaming Mouse",
    description: "Logitech MX Master 3 Wireless Mouse",
    points: 800,
    category: "physical",
    icon: Gamepad2,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop",
    stock: 8,
    isLimited: false,
  },
  {
    id: "5",
    title: "1-on-1 Mentoring Session",
    description: "60-minute session with industry expert",
    points: 1200,
    category: "experience",
    icon: Star,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    stock: 3,
    isLimited: true,
  },
  {
    id: "6",
    title: "Learning Streak Booster",
    description: "Double points for 7 days",
    points: 150,
    category: "digital",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=200&fit=crop",
    stock: -1,
    isLimited: false,
  },
  {
    id: "7",
    title: "Tech Conference Ticket",
    description: "Virtual access to React Conference 2024",
    points: 1500,
    category: "experience",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&h=200&fit=crop",
    stock: 10,
    isLimited: true,
  },
  {
    id: "8",
    title: "Amazon Gift Card",
    description: "$50 Amazon gift card",
    points: 600,
    category: "physical",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
    stock: 15,
    isLimited: false,
  },
];

const recentRedemptions = [
  {
    title: "Coffee Shop Voucher",
    points: 300,
    date: "2 days ago",
    status: "delivered" as const,
  },
  {
    title: "Learning Streak Booster",
    points: 150,
    date: "1 week ago",
    status: "active" as const,
  },
  {
    title: "Premium Course Access",
    points: 500,
    date: "2 weeks ago",
    status: "expired" as const,
  },
];

export default function Rewards() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [redeemedItems, setRedeemedItems] = useState<Set<string>>(new Set());

  const userPoints = 2850; // This would come from your state management

  const categories = [
    { id: "all", label: "All Rewards", icon: Gift },
    { id: "digital", label: "Digital", icon: Zap },
    { id: "course", label: "Courses", icon: Book },
    { id: "physical", label: "Physical", icon: ShoppingBag },
    { id: "experience", label: "Experience", icon: Star },
  ];

  const filteredRewards = selectedCategory === "all"
    ? rewards
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = (rewardId: string, points: number) => {
    if (userPoints >= points && !redeemedItems.has(rewardId)) {
      setRedeemedItems(prev => new Set([...prev, rewardId]));
      // In a real app, you would update the user's points and send the redemption to your backend
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-success text-success-foreground";
      case "active": return "bg-primary text-primary-foreground";
      case "expired": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rewards Store</h1>
          <p className="text-slate-600">Redeem your points for amazing rewards</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-4 py-3">
          <Coins className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-yellow-800 text-lg">{userPoints.toLocaleString()}</span>
          <span className="text-yellow-600">points available</span>
        </div>
      </div>
           {/* Points Earning Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>How to Earn More Points</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-slate-900">Complete Lessons</h4>
              <p className="text-sm text-slate-600">Earn 25-50 points per lesson completed</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-slate-900">Finish Courses</h4>
              <p className="text-sm text-slate-600">Get 200-500 bonus points for course completion</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-slate-900">Achieve Streaks</h4>
              <p className="text-sm text-slate-600">Daily study streaks earn 10-100 points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Redemptions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Redemptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentRedemptions.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-600">{item.date}</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">-{item.points} points</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => {
              const Icon = reward.icon;
              const isRedeemed = redeemedItems.has(reward.id);
              const canAfford = userPoints >= reward.points;
              const isOutOfStock = reward.stock === 0;
              
              return (
                <Card key={reward.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {reward.isLimited && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        Limited
                      </Badge>
                    )}
                    {reward.discount && (
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                        -{reward.discount}%
                      </Badge>
                    )}
                    {isRedeemed && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-full p-3">
                          <CheckCircle className="w-8 h-8 text-success" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg line-clamp-1">{reward.title}</CardTitle>
                      </div>
                      {reward.stock > 0 && reward.stock <= 10 && (
                        <Badge variant="outline" className="text-xs">
                          {reward.stock} left
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{reward.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-600" />
                          <span className="font-bold text-lg text-slate-900">{reward.points.toLocaleString()}</span>
                          {reward.originalPoints && (
                            <span className="text-sm text-slate-500 line-through">
                              {reward.originalPoints.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {reward.category === "digital" && (
                          <Badge variant="secondary" className="text-xs">
                            Instant
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        className="w-full"
                        disabled={!canAfford || isRedeemed || isOutOfStock}
                        onClick={() => handleRedeem(reward.id, reward.points)}
                        variant={isRedeemed ? "outline" : "default"}
                      >
                        {isRedeemed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Redeemed
                          </>
                        ) : isOutOfStock ? (
                          "Out of Stock"
                        ) : !canAfford ? (
                          `Need ${(reward.points - userPoints).toLocaleString()} more points`
                        ) : (
                          "Redeem Now"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredRewards.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No rewards found</h3>
              <p className="text-slate-600">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </div>

 
      </div>
    </StudentLayout>
  );
}
