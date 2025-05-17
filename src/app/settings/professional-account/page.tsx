
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Briefcase, BarChart2, UserCheck, Settings2, Loader2 } from 'lucide-react'; // Added Loader2
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ProfessionalAccountPage() {
  const { toast } = useToast();
  // Simulate if user already has a professional account (or a pending request)
  const [isProfessional, setIsProfessional] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchToProfessional = () => {
    setIsSwitching(true);
    // TODO: Implement actual switch logic (API call to backend)
    console.log('Switching to professional account...');
    setTimeout(() => {
      setIsProfessional(true);
      setIsSwitching(false);
      toast({
        title: 'Switched to Professional Account!',
        description: 'You now have access to professional tools and analytics.',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Button variant="outline" size="sm" asChild>
        <Link href="/settings">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="h-6 w-6 text-primary" />
            Professional Account
          </CardTitle>
          <CardDescription>
            {isProfessional 
              ? "You are currently using a Professional Account."
              : "Unlock tools to grow your presence and understand your audience on AKmax."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isProfessional ? (
            <div className="space-y-3 p-4 border rounded-md bg-green-50 dark:bg-green-900/30">
              <h3 className="font-semibold text-green-700 dark:text-green-300">Professional Tools Activated!</h3>
              <p className="text-sm text-muted-foreground">
                You can now access enhanced analytics, promotion tools, and more.
              </p>
              <Button variant="outline" asChild>
                <Link href="/profile/analytics"><BarChart2 className="mr-2 h-4 w-4" /> View Analytics</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Switching to a professional account gives you access to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                <li>Detailed content analytics and audience insights.</li>
                <li>Advanced profile customization options.</li>
                <li>Tools to promote your posts and reach a wider audience.</li>
                <li>Option to categorize your profile (e.g., Creator, Business).</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                Switching is free and can be reverted at any time from your account settings.
              </p>
            </>
          )}
        </CardContent>
        {!isProfessional && (
          <CardFooter className="border-t pt-6">
            <Button onClick={handleSwitchToProfessional} className="w-full" disabled={isSwitching}>
              {isSwitching ? (
                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Switching... </>
              ) : (
                <> <UserCheck className="mr-2 h-4 w-4" /> Switch to Professional Account </>
              )}
            </Button>
          </CardFooter>
        )}
         {isProfessional && (
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                You can manage professional account settings or switch back to a personal account in your account settings (feature coming soon).
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
