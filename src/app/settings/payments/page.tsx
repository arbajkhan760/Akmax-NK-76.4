
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit, CreditCard, Landmark, Bot, Smartphone, IndianRupee, Settings, MoreHorizontal } from 'lucide-react'; // Added MoreHorizontal
import Link from 'next/link';

// --- TODO: Fetch Real Data ---
// Replace mocks with actual API calls

type PaymentMethodType = 'card' | 'upi'; // For purchases
type WithdrawalMethodType = 'upi' | 'bank' | 'paypal' | 'paytm'; // For earnings

interface SavedPaymentMethod {
    id: string;
    type: PaymentMethodType;
    details: string; // e.g., **** **** **** 1234 (Visa), user@okaxis
    isDefault?: boolean;
}

interface SavedWithdrawalMethod {
    id: string;
    type: WithdrawalMethodType;
    details: string; // e.g., UPI ID, Masked Account Number, PayPal Email, Paytm Number
    isDefault?: boolean;
}

// Mock Data
const mockPaymentMethods: SavedPaymentMethod[] = [
    { id: 'pm1', type: 'card', details: '**** **** **** 4242 (Visa)', isDefault: true },
    { id: 'pm2', type: 'upi', details: 'myusername@okicici' },
];

const mockWithdrawalMethods: SavedWithdrawalMethod[] = [
    { id: 'wm1', type: 'upi', details: 'user@okhdfcbank', isDefault: true },
    { id: 'wm2', type: 'bank', details: '******1234 (HDFC)', isDefault: false },
    { id: 'wm3', type: 'paypal', details: 'user@example.com', isDefault: false },
];

export default function ManagePaymentsPage() {
    const { toast } = useToast();
    const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
    const [withdrawalMethods, setWithdrawalMethods] = useState<SavedWithdrawalMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // State for Add/Edit Dialogs (example for withdrawal)
    const [isAddWithdrawalOpen, setIsAddWithdrawalOpen] = useState(false);
    const [newMethodType, setNewMethodType] = useState<WithdrawalMethodType>('upi');
    const [newMethodDetails, setNewMethodDetails] = useState<Record<string, string>>({}); // Store details like UPI ID, Account No etc.

    useEffect(() => {
        // Simulate loading data
        setIsLoading(true);
        setTimeout(() => {
            setPaymentMethods(mockPaymentMethods);
            setWithdrawalMethods(mockWithdrawalMethods);
            setIsLoading(false);
        }, 800);
    }, []);

    // --- Action Handlers (Mocks) ---

    const handleAddWithdrawalMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Adding withdrawal method:", newMethodType, newMethodDetails);
        // --- TODO: Add API call to save the new method ---
        // Basic validation example:
        let isValid = true;
        let detailsString = '';
        if (newMethodType === 'upi' && !newMethodDetails.upiId) isValid = false; else if (newMethodType === 'upi') detailsString = newMethodDetails.upiId;
        if (newMethodType === 'bank' && (!newMethodDetails.accountNumber || !newMethodDetails.ifscCode || !newMethodDetails.accountHolderName)) isValid = false; else if (newMethodType === 'bank') detailsString = `******${newMethodDetails.accountNumber.slice(-4)} (${newMethodDetails.ifscCode.substring(0, 4)})`; // Masked details
        if (newMethodType === 'paypal' && !newMethodDetails.paypalEmail) isValid = false; else if (newMethodType === 'paypal') detailsString = newMethodDetails.paypalEmail;
        if (newMethodType === 'paytm' && !newMethodDetails.paytmNumber) isValid = false; else if (newMethodType === 'paytm') detailsString = newMethodDetails.paytmNumber;


        if (!isValid) {
            toast({ variant: 'destructive', title: 'Invalid Details', description: 'Please fill in all required fields correctly.' });
            return;
        }

        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        const newMethod: SavedWithdrawalMethod = {
            id: `wm${Date.now()}`,
            type: newMethodType,
            details: detailsString, // Use the created details string
            isDefault: withdrawalMethods.length === 0 // Make first added default
        };
        setWithdrawalMethods(prev => [...prev, newMethod]);
        toast({ title: 'Success', description: `Withdrawal method (${newMethodType}) added.` });
        setIsAddWithdrawalOpen(false);
        setNewMethodDetails({}); // Reset form
    };

    const handleSetDefault = async (methodId: string, type: 'payment' | 'withdrawal') => {
        console.log(`Setting default ${type} method: ${methodId}`);
        // --- TODO: Add API call to update default status ---
        await new Promise(res => setTimeout(res, 500));

        if (type === 'payment') {
            setPaymentMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === methodId })));
        } else {
             setWithdrawalMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === methodId })));
        }
        toast({ title: 'Default Updated', description: 'Your default method has been changed.' });
    };

     const handleDelete = async (methodId: string, type: 'payment' | 'withdrawal') => {
         if (!confirm(`Are you sure you want to delete this ${type} method?`)) return;

        console.log(`Deleting ${type} method: ${methodId}`);
         // --- TODO: Add API call to delete the method ---
        await new Promise(res => setTimeout(res, 500));

         if (type === 'payment') {
             setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
         } else {
              setWithdrawalMethods(prev => prev.filter(m => m.id !== methodId));
         }
         toast({ title: 'Method Deleted', description: `The selected ${type} method has been removed.` });
     };

    const getWithdrawalMethodInputFields = () => {
        switch(newMethodType) {
            case 'upi': return (
                <FormItem> <FormLabel>UPI ID</FormLabel> <FormControl><Input required placeholder="yourname@bank" value={newMethodDetails.upiId || ''} onChange={(e) => setNewMethodDetails(prev => ({...prev, upiId: e.target.value}))} /></FormControl> </FormItem>
            );
             case 'bank': return (
                <>
                    <FormItem> <FormLabel>Account Holder Name</FormLabel> <FormControl><Input required placeholder="Full Name" value={newMethodDetails.accountHolderName || ''} onChange={(e) => setNewMethodDetails(prev => ({...prev, accountHolderName: e.target.value}))} /></FormControl> </FormItem>
                    <FormItem> <FormLabel>Account Number</FormLabel> <FormControl><Input required placeholder="Enter Account Number" value={newMethodDetails.accountNumber || ''} onChange={(e) => setNewMethodDetails(prev => ({...prev, accountNumber: e.target.value}))} /></FormControl> </FormItem>
                    <FormItem> <FormLabel>IFSC Code</FormLabel> <FormControl><Input required placeholder="Enter IFSC Code" value={newMethodDetails.ifscCode || ''} onChange={(e) => setNewMethodDetails(prev => ({...prev, ifscCode: e.target.value}))} /></FormControl> </FormItem>
                </>
            );
             case 'paypal': return (
                 <FormItem> <FormLabel>PayPal Email</FormLabel> <FormControl><Input required type="email" placeholder="you@example.com" value={newMethodDetails.paypalEmail || ''} onChange={(e) => setNewMethodDetails(prev => ({...prev, paypalEmail: e.target.value}))} /></FormControl> </FormItem>
            );
             case 'paytm': return (
                 <FormItem> <FormLabel>Registered Paytm Number</FormLabel> <FormControl><Input required type="tel" placeholder="Enter phone number" value={newMethodDetails.paytmNumber || ''} onChange={(e) => setNewMethodDetails(prev => ({...prev, paytmNumber: e.target.value}))} /></FormControl> </FormItem>
            );
            default: return null;
        }
    }


    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Payment & Withdrawal Methods</h1>
                 <Button variant="outline" size="sm" asChild>
                     <Link href="/settings">← Back to Settings</Link>
                 </Button>
            </div>

            {/* Payment Methods (for Purchases) */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Manage cards and UPI IDs used for purchases.</CardDescription>
                        </div>
                         {/* --- TODO: Implement Add Payment Method Dialog --- */}
                         <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Payment Method</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? <p>Loading payment methods...</p> : paymentMethods.length > 0 ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Default</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentMethods.map(method => (
                                    <TableRow key={method.id}>
                                        <TableCell className="capitalize flex items-center">{method.type === 'card' ? <CreditCard className="h-4 w-4 mr-2"/> : <IndianRupee className="h-4 w-4 mr-2"/>}{method.type}</TableCell>
                                        <TableCell>{method.details}</TableCell>
                                        <TableCell>{method.isDefault ? <span className="text-green-600 font-medium">Yes</span> : 'No'}</TableCell>
                                        <TableCell className="text-right">
                                            {!method.isDefault && <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id, 'payment')}>Set Default</Button>}
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(method.id, 'payment')}><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No payment methods saved yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* Withdrawal Methods (for Earnings) */}
             <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                         <div>
                            <CardTitle>Withdrawal Methods</CardTitle>
                            <CardDescription>Manage accounts for receiving your earnings.</CardDescription>
                        </div>
                         <Dialog open={isAddWithdrawalOpen} onOpenChange={setIsAddWithdrawalOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Withdrawal Method</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Withdrawal Method</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddWithdrawalMethod} className="space-y-4 py-4">
                                     <FormItem>
                                        <FormLabel>Method Type</FormLabel>
                                        <FormControl>
                                             <Select value={newMethodType} onValueChange={(value) => setNewMethodType(value as WithdrawalMethodType)}>
                                                <SelectTrigger> <SelectValue placeholder="Select method type" /> </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="upi">UPI</SelectItem>
                                                    <SelectItem value="bank">Bank Account</SelectItem>
                                                    <SelectItem value="paypal">PayPal</SelectItem>
                                                     <SelectItem value="paytm">Paytm</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>

                                     {/* Dynamic fields based on type */}
                                    {getWithdrawalMethodInputFields()}

                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                        <Button type="submit">Save Method</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                 <CardContent>
                     {isLoading ? <p>Loading withdrawal methods...</p> : withdrawalMethods.length > 0 ? (
                         <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Default</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawalMethods.map(method => (
                                    <TableRow key={method.id}>
                                        <TableCell className="capitalize flex items-center">
                                             {method.type === 'upi' && <IndianRupee className="h-4 w-4 mr-2"/>}
                                             {method.type === 'bank' && <Landmark className="h-4 w-4 mr-2"/>}
                                             {method.type === 'paypal' && <Bot className="h-4 w-4 mr-2"/>}
                                             {method.type === 'paytm' && <Smartphone className="h-4 w-4 mr-2"/>}
                                             {method.type}
                                        </TableCell>
                                        <TableCell>{method.details}</TableCell>
                                        <TableCell>{method.isDefault ? <span className="text-green-600 font-medium">Yes</span> : 'No'}</TableCell>
                                        <TableCell className="text-right">
                                            {!method.isDefault && <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id, 'withdrawal')}>Set Default</Button>}
                                             {/* --- TODO: Add Edit Functionality --- */}
                                             {/* <Button variant="ghost" size="sm"><Edit className="h-4 w-4"/></Button> */}
                                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(method.id, 'withdrawal')}><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     ) : (
                         <p className="text-muted-foreground text-center py-4">No withdrawal methods saved yet.</p>
                     )}
                </CardContent>
            </Card>

        </div>
    );
}

// Reusable FormItem, FormLabel, FormControl components (or import from '@/components/ui/form' if available)
const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`space-y-1 ${className || ''}`} {...props} />
);
const FormLabel = ({ className, ...props }: React.ComponentProps<typeof Label>) => (
  <Label className={`text-sm font-medium ${className || ''}`} {...props} />
);
const FormControl = ({ ...props }: { children: React.ReactNode }) => (
  <div {...props} />
);
