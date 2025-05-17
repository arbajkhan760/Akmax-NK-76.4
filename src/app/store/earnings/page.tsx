
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Download, TrendingUp, CheckCircle, Clock, IndianRupee, Landmark, Bot, Smartphone, Settings } from 'lucide-react'; // Added icons
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// --- TODO: Fetch Real Data ---
// Replace these mocks with data fetched from your backend API
// based on the logged-in user.

interface EarningsSummary {
  availableBalance: number;
  pendingEarnings: number;
  totalClicks: number;
  totalPurchases: number;
  withdrawalThreshold: number; // Minimum amount needed to withdraw
}

interface RecentTransaction {
  id: string;
  date: string;
  description: string; // e.g., "Commission from Product X", "Withdrawal"
  amount: number;
  status: 'completed' | 'pending' | 'withdrawal' | 'failed'; // Added failed status
}

// --- TODO: Fetch Saved Withdrawal Methods ---
type WithdrawalMethodType = 'upi' | 'bank' | 'paypal' | 'paytm';
interface SavedWithdrawalMethod {
    id: string;
    type: WithdrawalMethodType;
    details: string; // e.g., UPI ID, Masked Account Number, PayPal Email, Paytm Number
    isDefault?: boolean;
}

const mockSummary: EarningsSummary = {
  availableBalance: 1250.75,
  pendingEarnings: 350.50,
  totalClicks: 1580,
  totalPurchases: 85,
  withdrawalThreshold: 500, // Example threshold
};

const mockTransactions: RecentTransaction[] = [
  { id: 'txn1', date: '2024-08-15', description: 'Commission: T-Shirt Sale', amount: 45.00, status: 'completed' },
  { id: 'txn2', date: '2024-08-14', description: 'Commission: Electronics Gadget', amount: 120.50, status: 'pending' },
  { id: 'txn3', date: '2024-08-12', description: 'Commission: Book Purchase', amount: 15.25, status: 'completed' },
  { id: 'txn4', date: '2024-08-10', description: 'Withdrawal Initiated (UPI)', amount: -800.00, status: 'withdrawal' },
  { id: 'txn5', date: '2024-08-09', description: 'Commission: Beauty Product', amount: 80.00, status: 'completed' },
   { id: 'txn6', date: '2024-08-05', description: 'Withdrawal Failed (Bank)', amount: 0, status: 'failed' }, // Example failed
];

// --- Mock Saved Methods ---
const mockSavedMethods: SavedWithdrawalMethod[] = [
    { id: 'wm1', type: 'upi', details: 'user@okhdfcbank', isDefault: true },
    { id: 'wm2', type: 'bank', details: '******1234 (HDFC)' },
    { id: 'wm3', type: 'paypal', details: 'user@example.com' },
];


export default function EarningsPage() {
   const { toast } = useToast();
   const [summary, setSummary] = useState<EarningsSummary | null>(null);
   const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
   const [savedMethods, setSavedMethods] = useState<SavedWithdrawalMethod[]>([]); // State for saved methods
   const [selectedMethod, setSelectedMethod] = useState<string | undefined>(undefined); // ID of selected saved method
   const [isWithdrawalLoading, setIsWithdrawalLoading] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setSummary(mockSummary);
        setTransactions(mockTransactions);
        setSavedMethods(mockSavedMethods); // Load mock saved methods
         // Set default selected method
        const defaultMethod = mockSavedMethods.find(m => m.isDefault);
        setSelectedMethod(defaultMethod?.id);
        setIsLoading(false);
    };
    fetchData();
  }, []);

   const handleWithdraw = async () => {
      if (!summary || summary.availableBalance < summary.withdrawalThreshold) {
         toast({ variant: 'destructive', title: "Withdrawal Not Possible", description: `Minimum ₹${summary?.withdrawalThreshold.toFixed(2)} required.` });
         return;
      }
      if (!selectedMethod) {
           toast({ variant: 'destructive', title: "Select Method", description: "Please select a withdrawal method." });
           return;
      }

      const methodDetails = savedMethods.find(m => m.id === selectedMethod);
      if (!methodDetails) return; // Should not happen

      setIsWithdrawalLoading(true);
      console.log(`Initiating withdrawal of ₹${summary.availableBalance.toFixed(2)} to ${methodDetails.type}: ${methodDetails.details}`);

      // --- TODO: Implement Actual Withdrawal API Call ---
      // Send amount, method type, method ID/details to your backend.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      const success = Math.random() > 0.2; // Simulate success/failure

      setIsWithdrawalLoading(false);

      if (success) {
          toast({
              title: "Withdrawal Initiated",
              description: `Withdrawal of ₹${summary.availableBalance.toFixed(2)} to ${methodDetails.details} is being processed.`
          });
          // --- TODO: Update summary and transactions list after successful request ---
          // e.g., setSummary({ ...summary, availableBalance: 0, pendingWithdrawal: summary.availableBalance });
          // add new transaction to transactions list
      } else {
           toast({
                variant: 'destructive',
                title: "Withdrawal Failed",
                description: "Could not process your withdrawal request. Please try again later or contact support."
           });
      }
      // Close the dialog if needed (or keep it open on failure?)
      // Potentially update the saved methods state if necessary
   };

  const progress = summary ? (summary.availableBalance / summary.withdrawalThreshold) * 100 : 0;

  const getMethodIcon = (type: WithdrawalMethodType) => {
      switch(type) {
          case 'upi': return <IndianRupee className="h-4 w-4 mr-2 text-purple-600"/>; // Or a dedicated UPI icon
          case 'bank': return <Landmark className="h-4 w-4 mr-2 text-blue-600"/>;
          case 'paypal': return <Bot className="h-4 w-4 mr-2 text-blue-800"/>; // PayPal logo-like
          case 'paytm': return <Smartphone className="h-4 w-4 mr-2 text-sky-500"/>; // Paytm logo-like
          default: return <Wallet className="h-4 w-4 mr-2"/>;
      }
  }

  if (isLoading) {
     return (
         <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold tracking-tight">My Earnings</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link href="/store">← Back to Store</Link>
                 </Button>
            </div>
             <Card>
                 <CardHeader><CardTitle>Loading Earnings...</CardTitle></CardHeader>
                 <CardContent className="text-center p-10">
                    <p className="text-muted-foreground">Fetching your earnings data...</p>
                 </CardContent>
             </Card>
         </div>
     );
  }


  if (!summary) {
     return (
         <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold tracking-tight">My Earnings</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link href="/store">← Back to Store</Link>
                 </Button>
            </div>
             <Card>
                 <CardHeader><CardTitle className="text-destructive">Error</CardTitle></CardHeader>
                 <CardContent className="text-center p-10">
                    <p className="text-destructive-foreground">Could not load earnings data. Please try again later.</p>
                 </CardContent>
             </Card>
         </div>
     );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Earnings</h1>
         <Button variant="outline" size="sm" asChild>
           <Link href="/store">← Back to Store</Link>
        </Button>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.availableBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summary.pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation/payout</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Link Performance</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{summary.totalClicks} Clicks</div>
            <p className="text-xs text-muted-foreground">{summary.totalPurchases} Purchases</p>
          </CardContent>
        </Card>
      </div>

       {/* Withdrawal Section */}
       <Card>
          <CardHeader>
            <CardTitle>Withdraw Earnings</CardTitle>
            <CardDescription>
              Withdraw your available balance once you reach the minimum threshold of ₹{summary.withdrawalThreshold.toFixed(2)}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
             <Progress value={progress} className="w-full h-2" />
             <p className="text-sm text-muted-foreground text-center">
                 {progress >= 100 ? "Threshold reached!" : `₹${(summary.withdrawalThreshold - summary.availableBalance).toFixed(2)} more to withdraw`}
            </p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row items-start sm:items-center gap-4">
             {/* Withdrawal Dialog Trigger */}
             <Dialog>
                 <DialogTrigger asChild>
                    <Button
                       disabled={summary.availableBalance < summary.withdrawalThreshold || savedMethods.length === 0}
                    >
                       <Download className="mr-2 h-4 w-4" /> Withdraw ₹{summary.availableBalance.toFixed(2)}
                    </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                       <DialogTitle>Confirm Withdrawal</DialogTitle>
                       <DialogDescription>
                           Select a method to withdraw ₹{summary.availableBalance.toFixed(2)}. Processing times may vary.
                       </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Select Withdrawal Method</Label>
                        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                            {savedMethods.map((method) => (
                                <div key={method.id} className="flex items-center space-x-2 border rounded-md p-3 has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value={method.id} id={method.id} />
                                    <Label htmlFor={method.id} className="flex items-center cursor-pointer flex-1">
                                        {getMethodIcon(method.type)}
                                        <span className="flex-1">{method.details}</span>
                                        {method.isDefault && <span className="text-xs text-muted-foreground ml-2">(Default)</span>}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                         {savedMethods.length === 0 && (
                            <p className="text-sm text-destructive text-center py-4">
                                Please add a withdrawal method first in Settings.
                            </p>
                         )}
                    </div>
                    <DialogFooter>
                       <Button
                           type="button"
                           onClick={handleWithdraw}
                           disabled={isWithdrawalLoading || !selectedMethod || summary.availableBalance < summary.withdrawalThreshold}
                       >
                           {isWithdrawalLoading ? "Processing..." : "Confirm Withdrawal"}
                       </Button>
                    </DialogFooter>
                 </DialogContent>
             </Dialog>

             {/* Manage Methods Button */}
             <Button variant="outline" size="sm" className="ml-auto" asChild>
               {/* --- TODO: Link to actual settings page for withdrawal methods --- */}
               <Link href="/settings/payments">
                   <Settings className="mr-2 h-4 w-4" /> Manage Methods
                </Link>
             </Button>
          </CardFooter>
        </Card>


      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
           <CardDescription>History of your earnings and withdrawals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.date}</TableCell>
                    <TableCell>{tx.description}</TableCell>
                     <TableCell>
                         <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full w-fit capitalize ${
                             tx.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                             tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                             tx.status === 'withdrawal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                             'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' // Failed or other status
                         }`}>
                             {tx.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1"/> :
                              tx.status === 'pending' ? <Clock className="h-3 w-3 mr-1"/> :
                              tx.status === 'withdrawal' ? <Download className="h-3 w-3 mr-1"/> :
                              <Clock className="h-3 w-3 mr-1 text-red-500"/> /* Example icon for failed */
                             }
                             {tx.status}
                         </span>
                     </TableCell>
                    <TableCell className={`text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : tx.amount < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                       {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                     <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No transactions yet.
                     </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
