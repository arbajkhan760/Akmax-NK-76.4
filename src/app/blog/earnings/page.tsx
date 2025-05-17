
'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, Wallet, Download, CheckCircle, Clock, AlertTriangle, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import type { WriterEarningSummary, EarningTransaction } from '@/types/blog';
import { getWriterEarningsSummary, getWriterTransactions } from '@/services/blog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock current user ID - replace with actual auth logic
const MOCK_USER_ID = 'user123';

const EarningsPage: NextPage = () => {
  const [summary, setSummary] = useState<WriterEarningSummary | null>(null);
  const [transactions, setTransactions] = useState<EarningTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedSummary, fetchedTransactions] = await Promise.all([
          getWriterEarningsSummary(MOCK_USER_ID),
          getWriterTransactions(MOCK_USER_ID),
        ]);
        setSummary(fetchedSummary);
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Failed to fetch earnings data:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load earnings data." });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [toast]);

  const handleWithdraw = () => {
      // TODO: Implement withdrawal logic (e.g., open a dialog, call API)
      toast({ title: "Withdrawal Initiated (Demo)", description: "Withdrawal functionality is not yet implemented." });
  };

  if (isLoading) {
    return <div className="container mx-auto max-w-4xl py-10 text-center">Loading earnings...</div>;
  }

  if (!summary) {
    return <div className="container mx-auto max-w-4xl py-10 text-center text-destructive">Could not load earnings summary.</div>;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <TrendingUp className="mr-3 h-8 w-8 text-primary" />
          My Earnings
        </h1>
         <Button variant="outline" size="sm" asChild>
            <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><Wallet className="h-4 w-4"/> Total Earned</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(summary.totalEarnings)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Lifetime earnings from your articles/stories.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><IndianRupee className="h-4 w-4"/> Pending Payout</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(summary.pendingEarnings)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Earnings awaiting next payout cycle.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1"><Download className="h-4 w-4"/> Total Withdrawn</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(summary.withdrawnEarnings)}</CardTitle>
          </CardHeader>
          <CardContent>
             {summary.lastWithdrawalDate && (
                <p className="text-xs text-muted-foreground">
                    Last withdrawal: {format(new Date(summary.lastWithdrawalDate), 'MMM d, yyyy')}
                </p>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Action Card - Simplified */}
       <Card>
            <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Withdraw your available balance. Minimum withdrawal amount may apply.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-semibold">Available for withdrawal: {formatCurrency(summary.totalEarnings - summary.pendingEarnings - summary.withdrawnEarnings)}</p>
                 {/* TODO: Add actual withdrawal threshold check */}
            </CardContent>
            <CardFooter>
                <Button onClick={handleWithdraw} disabled={(summary.totalEarnings - summary.pendingEarnings - summary.withdrawnEarnings) <=0 }>
                    <Download className="mr-2 h-4 w-4"/> Request Withdrawal
                </Button>
                {/* TODO: Link to payment settings page */}
                <Button variant="link" asChild className="ml-auto">
                    <Link href="/settings/payments">Manage Payment Methods</Link>
                </Button>
            </CardFooter>
        </Card>


      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Overview of your earnings and withdrawals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{format(new Date(tx.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="font-medium line-clamp-1">{tx.storyOrSeriesTitle}</TableCell>
                  <TableCell className="capitalize">{tx.type}</TableCell>
                  <TableCell>
                    <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full w-fit capitalize ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        tx.status === 'withdrawal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' // Failed status
                    }`}>
                        {tx.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3"/>}
                        {tx.status === 'pending' && <Clock className="mr-1 h-3 w-3"/>}
                         {tx.status === 'withdrawal' && <Download className="mr-1 h-3 w-3"/>}
                        {tx.status === 'failed' && <AlertTriangle className="mr-1 h-3 w-3"/>}
                        {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">No transactions yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsPage;

