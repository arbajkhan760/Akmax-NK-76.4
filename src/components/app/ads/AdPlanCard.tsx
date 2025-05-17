'use client';

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, CalendarDays, Repeat, Infinity, Sparkles } from 'lucide-react'; // Added Sparkles
import type { AdPlan } from '@/types/ads';
import { cn } from '@/lib/utils';

interface AdPlanCardProps {
  plan: AdPlan;
  onChoosePlan: (plan: AdPlan) => void;
  isCurrentPlan?: boolean;
  isDisabled?: boolean;
}

const AdPlanCard: FC<AdPlanCardProps> = ({ plan, onChoosePlan, isCurrentPlan, isDisabled }) => {
  const getFrequencyText = (plan: AdPlan) => {
     if (plan.durationDays === 7 && plan.id.includes('weekly')) return "/ week";
     if (plan.durationDays === 30 && plan.id.includes('monthly')) return "/ month";
     if (plan.durationDays === 365 && plan.id.includes('yearly')) return "/ year";
     if (plan.id.includes('daily')) return "/ day";
     if (plan.id.includes('onetime')) return `for ${plan.durationDays} days`;
     return "";
  }

  const getAdsAllowedText = (plan: AdPlan) => {
     if (plan.adsAllowed === null) return <><Infinity className="inline h-4 w-4 mr-1"/> Unlimited Ads</>;
     if (plan.id.includes('daily')) return `${plan.adsAllowed} Ad / Day`;
     if (plan.durationDays === 7 && plan.adsAllowed === 1) return `${plan.adsAllowed} Ad Total`; // One-time plan
     if (plan.id.includes('monthly')) return `${plan.adsAllowed} Ads / Month`;
     if (plan.id.includes('yearly') && plan.adsAllowed === 365) return `1 Ad / Day`;
     return `${plan.adsAllowed} Ads`;
  }

  return (
    <Card className={cn(
        "flex flex-col h-full transition-all",
        isCurrentPlan ? "border-2 border-green-500 ring-2 ring-green-500/20" : "border",
        isDisabled ? "opacity-60 bg-muted/50 cursor-not-allowed" : "hover:shadow-lg", // Added cursor-not-allowed
        plan.isPremium ? "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10" : ""
    )}>
      <CardHeader className="pb-4">
        {plan.isPremium && (
            <div className="flex items-center text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">
                <Star className="h-4 w-4 mr-1 fill-current"/> Premium Plan
            </div>
        )}
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <p className="text-3xl font-bold">
          ₹{plan.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{getFrequencyText(plan)}</span>
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> {getAdsAllowedText(plan)}
            </li>
            <li className="flex items-center gap-2">
                 <CalendarDays className="h-4 w-4 text-primary" /> Valid for {plan.durationDays} days
            </li>
             <li className="flex items-center gap-2">
                 <Repeat className="h-4 w-4 text-primary" /> Access to All Ad Formats
            </li>
             {/* Add more features/benefits here */}
             {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> {feature}
                </li>
             ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onChoosePlan(plan)}
          disabled={isCurrentPlan || isDisabled} 
        >
          {isCurrentPlan ? 'Currently Active' : 'Choose Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdPlanCard;
