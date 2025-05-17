
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Loader2, IndianRupee, Sparkles, QrCode, Landmark } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import AdPlanCard from '@/components/app/ads/AdPlanCard'; // Component to display each plan
import type { AdPlan, UserAdStatus } from '@/types/ads'; // Import types
import { getAdPlans, getUserAdStatus, submitUtrForPlan } from '@/services/adService'; // Import service
import Image from 'next/image'; // Import for QR code

// Mock user ID - replace with actual authentication
const MOCK_USER_ID = 'user123';

export default function PromotePage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<AdPlan[]>([]);
  const [userAdStatus, setUserAdStatus] = useState<UserAdStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<AdPlan | null>(null);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [utrCode, setUtrCode] = useState('');
  const [isVerifyingUTR, setIsVerifyingUTR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedPlans, fetchedStatus] = await Promise.all([
          getAdPlans(),
          getUserAdStatus(MOCK_USER_ID),
        ]);
        setPlans(fetchedPlans);
        setUserAdStatus(fetchedStatus);
      } catch (error) {
        console.error("Failed to load promotion data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load promotion details.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleChoosePlan = (plan: AdPlan) => {
    if (userAdStatus?.activePlanId === plan.id) {
      return;
    }
    setSelectedPlan(plan);
    setIsVerificationDialogOpen(true);
    setUtrCode(''); 
  };

  const handleVerifyUtr = async () => {
    if (!selectedPlan || !utrCode.trim()) return;
    setIsVerifyingUTR(true);
    try {
        const activationResult = await submitUtrForPlan(MOCK_USER_ID, selectedPlan.id, utrCode);

        if (activationResult.success) {
            setUserAdStatus({
                userId: MOCK_USER_ID,
                activePlanId: selectedPlan.id,
                planName: selectedPlan.name,
                planExpiryDate: activationResult.expiryDate,
                adsRemaining: activationResult.adsRemaining,
                isVerified: true,
            });
            toast({ title: "Plan Activated!", description: `Your ${selectedPlan.name} plan is now active.` });
            setIsVerificationDialogOpen(false);
            setSelectedPlan(null); 
        } else {
            throw new Error(activationResult.error || 'UTR verification failed.');
        }
    } catch (error: any) {
        console.error("UTR verification error:", error);
        toast({ variant: "destructive", title: "Verification Failed", description: error.message || "Invalid UTR code or payment issue. Please check and try again." });
    } finally {
        setIsVerifyingUTR(false);
    }
  };


  if (isLoading) {
    return <div className="text-center py-10">Loading promotion plans...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-6 space-y-8">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Promote on AKmax</h1>
          <Button variant="outline" size="sm" asChild>
             <Link href="/settings">← Back to Settings</Link>
          </Button>
      </div>

       {userAdStatus?.activePlanId ? (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
             <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-green-800 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" /> Active Plan: {userAdStatus.planName}
                </CardTitle>
                 <CardDescription className="text-green-700 dark:text-green-400">
                    Your promotion plan is active until {userAdStatus.planExpiryDate ? new Date(userAdStatus.planExpiryDate).toLocaleDateString() : 'N/A'}.
                     {typeof userAdStatus.adsRemaining === 'number' && ` Ads remaining: ${userAdStatus.adsRemaining}.`}
                 </CardDescription>
             </CardHeader>
              <CardFooter className="gap-2">
                  <Button asChild><Link href="/ads/create">Create Ad</Link></Button>
                  <Button variant="outline" asChild><Link href="/ads/dashboard">View Dashboard</Link></Button>
              </CardFooter>
          </Card>
       ) : (
           <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Get Started with Promotions!</AlertTitle>
                <AlertDescription>
                Choose a plan below to start promoting your content or products on AKmax. Reach a wider audience and achieve your goals.
                </AlertDescription>
            </Alert>
       )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => {
            return (
              <AdPlanCard
                key={plan.id}
                plan={plan}
                onChoosePlan={handleChoosePlan}
                isCurrentPlan={userAdStatus?.activePlanId === plan.id}
              />
            );
        })}
      </div>

      <Dialog open={isVerificationDialogOpen} onOpenChange={(open) => { if (!open) setSelectedPlan(null); setIsVerificationDialogOpen(open); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Payment & Verify: {selectedPlan?.name}</DialogTitle>
            <DialogDescription className="text-sm">
              To activate your <span className="font-semibold">{selectedPlan?.name}</span> plan, please pay <span className="font-semibold">₹{selectedPlan?.price.toFixed(2)}</span> using one of the methods below.
              After payment, enter the UTR/Transaction ID to complete verification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4 text-sm">
            <h3 className="font-semibold text-md">Payment Methods:</h3>
            <div className="space-y-3 p-3 border rounded-md bg-muted/30">
              <div>
                <p className="font-medium flex items-center gap-1"><IndianRupee className="h-4 w-4"/> UPI Payment:</p>
                <p>Pay to UPI ID: <span className="font-mono font-semibold text-primary">arbaj00100@fam</span></p>
              </div>
              <div>
                <p className="font-medium flex items-center gap-1"><QrCode className="h-4 w-4"/> Scan QR Code:</p>
                <div className="flex flex-col items-center my-2">
                  <Image src="https://picsum.photos/seed/akmax_upi_qr_promote/200/200" alt="UPI QR Code for arbaj00100@fam" width={150} height={150} data-ai-hint="QR code payment" className="rounded-md border"/>
                  <p className="text-xs text-muted-foreground mt-1">Scan with any UPI app</p>
                </div>
              </div>
              <div>
                <p className="font-medium flex items-center gap-1"><Landmark className="h-4 w-4"/> Bank Transfer (NEFT/IMPS):</p>
                <p>Account Name: <span className="font-semibold">AK Group 76</span></p>
                <p>Account Number: <span className="font-semibold">001234567890</span> (Example)</p>
                <p>IFSC Code: <span className="font-semibold">AKGR0000076</span> (Example)</p>
                <p>Bank Name: <span className="font-semibold">AKmax Bank</span> (Example)</p>
              </div>
            </div>

            <div className="space-y-1 pt-2">
                <Label htmlFor="utr-code" className="font-medium">Enter UTR / Transaction ID</Label>
                <Input
                id="utr-code"
                placeholder="e.g., UTR123456789012 or 12-digit ref no."
                value={utrCode}
                onChange={(e) => setUtrCode(e.target.value)}
                />
                 <p className="text-xs text-muted-foreground">This ID is provided by your payment app after successful payment.</p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isVerifyingUTR} onClick={() => setSelectedPlan(null)}>Cancel</Button></DialogClose>
            <Button onClick={handleVerifyUtr} disabled={isVerifyingUTR || !utrCode.trim() || !selectedPlan}>
              {isVerifyingUTR ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
              {isVerifyingUTR ? "Verifying..." : "Verify & Activate Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

