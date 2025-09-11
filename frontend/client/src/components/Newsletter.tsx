import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest("POST", "/api/newsletter-subscriptions", { email }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    subscriptionMutation.mutate(email);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Get the Latest Family <span className="text-white/90">Wellness News</span>
      </h2>
      <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
        Sign up for family support updates and resources to strengthen your relationships
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
        />
        <Button 
          type="submit" 
          disabled={subscriptionMutation.isPending}
          className="bg-white text-gray-800 hover:bg-gray-100 font-semibold"
        >
          {subscriptionMutation.isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      
      <p className="text-white/75 text-sm mt-4">
        Press 'Subscribe' to confirm your acceptance of the Terms of Service.
      </p>
    </div>
  );
}
