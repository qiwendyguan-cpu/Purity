import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, User, Sparkles } from "lucide-react";

interface AccountPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountPromptModal = ({ open, onOpenChange }: AccountPromptModalProps) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/auth");
  };

  const handleMaybeLater = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ready to personalize your experience?</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Create a free account to unlock these benefits:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Save Your Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Keep track of your skincare routine and beauty preferences across devices
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Personalized Skin Profile</h4>
              <p className="text-sm text-muted-foreground">
                Get product recommendations tailored to your unique skin type and concerns
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Wishlists & Favorites</h4>
              <p className="text-sm text-muted-foreground">
                Create collections of products you love and want to try
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleCreateAccount} className="w-full" size="lg">
            Create Free Account
          </Button>
          <Button onClick={handleMaybeLater} variant="ghost" className="w-full">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
