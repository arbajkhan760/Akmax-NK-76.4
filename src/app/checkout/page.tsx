
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Truck, Home, IndianRupee, Loader2, Landmark, Smartphone, Bot } from 'lucide-react'; // Added Landmark (Bank), Smartphone (Paytm), Bot (PayPal)
import Link from 'next/link';
import { processPayment, type PaymentDetails } from '@/services/payment'; // Import payment service

// --- TODO: Fetch Cart Summary & User Address ---
// Replace mocks with real data fetching logic

interface OrderSummary {
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  itemCount: number;
}

const mockOrderSummary: OrderSummary = {
  subtotal: 182.40, // Example from mock cart items
  shipping: 50.00,
  taxes: 9.12, // 5% of subtotal
  total: 241.52,
  itemCount: 3,
};

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(5, "Postal code is required").regex(/^\d{6}$/, "Invalid Indian PIN code"), // Basic Indian PIN
  country: z.string().min(2, "Country is required").default("India"), // Default to India
  phoneNumber: z.string().min(10, "Phone number is required").regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"), // Basic phone validation
});

const paymentSchema = z.object({
   paymentMethod: z.enum(["card", "upi", "cod", "paypal", "bank", "paytm"], { required_error: "Please select a payment method" }),
   // Card details
   cardNumber: z.string().optional(),
   expiryDate: z.string().optional(), // Simple MM/YY validation can be added
   cvv: z.string().optional(), // Simple 3-4 digit validation can be added
   // UPI ID
   upiId: z.string().optional(), // Add UPI format validation if needed
   // PayPal email
   paypalEmail: z.string().email({ message: "Invalid email address" }).optional(),
   // Bank details
   accountNumber: z.string().optional(), // Add bank account number validation
   ifscCode: z.string().optional(), // Add IFSC code validation
   accountHolderName: z.string().optional(),
   // Paytm number
   paytmNumber: z.string().optional(), // Add phone number validation

}).superRefine((data, ctx) => {
    if (data.paymentMethod === 'card') {
        if (!data.cardNumber || !/^\d{13,19}$/.test(data.cardNumber)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid card number", path: ["cardNumber"] });
        }
        if (!data.expiryDate || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.expiryDate)) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid expiry date (MM/YY)", path: ["expiryDate"] });
        }
        if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid CVV", path: ["cvv"] });
        }
    } else if (data.paymentMethod === 'upi') {
        // Basic UPI ID format check (can be improved)
        if (!data.upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(data.upiId)) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid UPI ID format", path: ["upiId"] });
        }
    } else if (data.paymentMethod === 'paypal') {
         if (!data.paypalEmail) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "PayPal email is required", path: ["paypalEmail"] });
         }
    } else if (data.paymentMethod === 'bank') {
        // Basic checks, can be made more robust
        if (!data.accountNumber || !/^\d{9,18}$/.test(data.accountNumber)) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid account number", path: ["accountNumber"] });
        }
        if (!data.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifscCode)) { // Basic IFSC format
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid IFSC code", path: ["ifscCode"] });
        }
         if (!data.accountHolderName || data.accountHolderName.length < 2) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Account holder name required", path: ["accountHolderName"] });
         }
    } else if (data.paymentMethod === 'paytm') {
        if (!data.paytmNumber || !/^\+?[1-9]\d{9,14}$/.test(data.paytmNumber)) { // Basic phone number check
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid Paytm phone number", path: ["paytmNumber"] });
        }
    }
});


// Combine schemas
const checkoutSchema = z.object({
    shipping: shippingAddressSchema,
    payment: paymentSchema,
});

export default function CheckoutPage() {
  const { toast } = useToast();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isDataLoading, setIsDataLoading] = useState(true); // For initial data load

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
         // --- TODO: Pre-fill with saved user address if available ---
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phoneNumber: '',
      },
      payment: {
        paymentMethod: undefined,
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        upiId: '',
        paypalEmail: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        paytmNumber: '',
      },
    },
  });

   useEffect(() => {
    // Simulate fetching order summary
     setIsDataLoading(true);
    setTimeout(() => {
      setOrderSummary(mockOrderSummary);
       // --- TODO: Fetch saved user address here and set form defaultValues ---
       // Example: form.reset({ shipping: savedAddress, payment: ... });
        setIsDataLoading(false);
    }, 800);
  }, []);

  const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
     if (!orderSummary) return;

    setIsLoading(true);
    console.log('Checkout Data:', values);

    // --- TODO: Implement Order Placement & Payment Logic ---
    // 1. Create an order object with items, shipping address, total amount, etc.
    // 2. Save the order details to your database (initially with a 'pending' status).
    // 3. Process Payment:
    //    - Use the details from `values.payment` based on `paymentMethod`.
    //    - Call relevant payment gateway or service.
    // 4. Handle Payment Success/Failure.

     // Placeholder Payment Processing Simulation
     const paymentDetails: PaymentDetails = {
         amount: orderSummary.total,
         currency: 'INR',
         description: `Order from AK Reels Store (${orderSummary.itemCount} items)`,
         paymentMethod: values.payment.paymentMethod, // Pass method type
         // Pass specific details based on method
         ...(values.payment.paymentMethod === 'card' && { cardDetails: { number: values.payment.cardNumber, expiry: values.payment.expiryDate, cvv: values.payment.cvv } }),
         ...(values.payment.paymentMethod === 'upi' && { upiId: values.payment.upiId }),
         ...(values.payment.paymentMethod === 'paypal' && { paypalEmail: values.payment.paypalEmail }),
         ...(values.payment.paymentMethod === 'bank' && { bankDetails: { accountNumber: values.payment.accountNumber, ifsc: values.payment.ifscCode, holderName: values.payment.accountHolderName } }),
         ...(values.payment.paymentMethod === 'paytm' && { paytmNumber: values.payment.paytmNumber }),
     };

     try {
         const paymentResult = await processPayment(paymentDetails); // Use imported service

         if (paymentResult.success) {
             toast({
                title: 'Order Placed Successfully!',
                description: `Your order is confirmed. Transaction ID: ${paymentResult.transactionId || 'N/A'}`,
             });
             // TODO: Clear cart and redirect to order confirmation page
             // Example: router.push('/order-confirmation/' + orderId);
             form.reset(); // Reset form for now
         } else {
             throw new Error(paymentResult.error || 'Payment failed');
         }

     } catch (error: any) {
         console.error("Checkout error:", error);
         toast({
             variant: 'destructive',
             title: 'Checkout Failed',
             description: error.message || 'Could not process your order. Please try again.',
         });
     } finally {
        setIsLoading(false);
     }
  };

   const selectedPaymentMethod = form.watch("payment.paymentMethod");

    if (isDataLoading || !orderSummary) {
      return <div className="text-center py-20">Loading checkout...</div>;
    }


  return (
    <div className="container mx-auto max-w-6xl py-8">
       <Button variant="outline" size="sm" asChild className="mb-6">
           <Link href="/cart">← Back to Cart</Link>
        </Button>

      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Shipping & Payment Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5"/> Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField control={form.control} name="shipping.fullName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 <FormField control={form.control} name="shipping.addressLine1" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl><Input placeholder="Street address, P.O. box, etc." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 <FormField control={form.control} name="shipping.addressLine2" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address Line 2 <span className="text-muted-foreground">(Optional)</span></FormLabel>
                        <FormControl><Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <FormField control={form.control} name="shipping.city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="Your city" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
                      <FormField control={form.control} name="shipping.state" render={({ field }) => (
                        <FormItem>
                            <FormLabel>State / Province</FormLabel>
                             {/* TODO: Replace with a Select dropdown for Indian states */}
                            <FormControl><Input placeholder="Your state" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
                      <FormField control={form.control} name="shipping.postalCode" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postal Code (PIN)</FormLabel>
                            <FormControl><Input placeholder="e.g., 110001" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
                 </div>
                   <FormField control={form.control} name="shipping.country" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                             <FormControl><Input disabled {...field} /></FormControl> {/* Disabled for now */}
                            <FormMessage />
                        </FormItem>
                     )} />
                  <FormField control={form.control} name="shipping.phoneNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input type="tel" placeholder="For delivery updates" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/> Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                 <FormField
                    control={form.control}
                    name="payment.paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-1"> {/* Reduced space */}
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-2" // Grid layout for better alignment
                          >
                             {/* Card */}
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[[data-state=checked]]:border-primary">
                              <FormControl> <RadioGroupItem value="card" id="pay-card"/> </FormControl>
                              <FormLabel htmlFor="pay-card" className="font-normal flex-1 cursor-pointer">Credit/Debit Card</FormLabel>
                            </FormItem>
                             {selectedPaymentMethod === 'card' && (
                                <div className="pl-8 ml-4 space-y-4 border-l py-4">
                                     <FormField control={form.control} name="payment.cardNumber" render={({ field }) => ( <FormItem> <FormLabel>Card Number</FormLabel> <FormControl><Input placeholder="**** **** **** ****" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                     <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="payment.expiryDate" render={({ field }) => ( <FormItem> <FormLabel>Expiry (MM/YY)</FormLabel> <FormControl><Input placeholder="MM/YY" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name="payment.cvv" render={({ field }) => ( <FormItem> <FormLabel>CVV</FormLabel> <FormControl><Input placeholder="123" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                     </div>
                                </div>
                            )}

                             {/* UPI */}
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[[data-state=checked]]:border-primary">
                              <FormControl> <RadioGroupItem value="upi" id="pay-upi"/> </FormControl>
                              <FormLabel htmlFor="pay-upi" className="font-normal flex-1 cursor-pointer">UPI</FormLabel>
                            </FormItem>
                             {selectedPaymentMethod === 'upi' && (
                                <div className="pl-8 ml-4 space-y-4 border-l py-4">
                                     <FormField control={form.control} name="payment.upiId" render={({ field }) => ( <FormItem> <FormLabel>UPI ID</FormLabel> <FormControl><Input placeholder="yourname@bank" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                     <FormDescription>You'll receive a payment request on your UPI app.</FormDescription>
                                </div>
                            )}

                             {/* PayPal */}
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[[data-state=checked]]:border-primary">
                              <FormControl> <RadioGroupItem value="paypal" id="pay-paypal"/> </FormControl>
                              <FormLabel htmlFor="pay-paypal" className="font-normal flex-1 cursor-pointer flex items-center gap-2"><Bot className="h-4 w-4"/> PayPal</FormLabel>
                            </FormItem>
                             {selectedPaymentMethod === 'paypal' && (
                                <div className="pl-8 ml-4 space-y-4 border-l py-4">
                                     <FormField control={form.control} name="payment.paypalEmail" render={({ field }) => ( <FormItem> <FormLabel>PayPal Email</FormLabel> <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                      <FormDescription>You'll be redirected to PayPal to complete the payment.</FormDescription>
                                </div>
                             )}

                              {/* Bank Transfer */}
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[[data-state=checked]]:border-primary">
                              <FormControl> <RadioGroupItem value="bank" id="pay-bank"/> </FormControl>
                              <FormLabel htmlFor="pay-bank" className="font-normal flex-1 cursor-pointer flex items-center gap-2"><Landmark className="h-4 w-4"/> Bank Transfer (NEFT/IMPS)</FormLabel>
                            </FormItem>
                             {selectedPaymentMethod === 'bank' && (
                                <div className="pl-8 ml-4 space-y-4 border-l py-4">
                                     <FormField control={form.control} name="payment.accountHolderName" render={({ field }) => ( <FormItem> <FormLabel>Account Holder Name</FormLabel> <FormControl><Input placeholder="Full Name" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                     <FormField control={form.control} name="payment.accountNumber" render={({ field }) => ( <FormItem> <FormLabel>Account Number</FormLabel> <FormControl><Input placeholder="Enter Account Number" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                     <FormField control={form.control} name="payment.ifscCode" render={({ field }) => ( <FormItem> <FormLabel>IFSC Code</FormLabel> <FormControl><Input placeholder="Enter IFSC Code" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                     <FormDescription>Complete the payment manually using the details provided after placing the order.</FormDescription>
                                </div>
                            )}

                             {/* Paytm */}
                             <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[[data-state=checked]]:border-primary">
                              <FormControl> <RadioGroupItem value="paytm" id="pay-paytm"/> </FormControl>
                              <FormLabel htmlFor="pay-paytm" className="font-normal flex-1 cursor-pointer flex items-center gap-2"><Smartphone className="h-4 w-4"/> Paytm Wallet / Postpaid</FormLabel>
                            </FormItem>
                             {selectedPaymentMethod === 'paytm' && (
                                <div className="pl-8 ml-4 space-y-4 border-l py-4">
                                    <FormField control={form.control} name="payment.paytmNumber" render={({ field }) => ( <FormItem> <FormLabel>Registered Paytm Number</FormLabel> <FormControl><Input type="tel" placeholder="Enter phone number linked to Paytm" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    <FormDescription>You might be asked for an OTP on the next step.</FormDescription>
                                </div>
                             )}

                            {/* COD */}
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[[data-state=checked]]:border-primary">
                              <FormControl> <RadioGroupItem value="cod" id="pay-cod"/> </FormControl>
                              <FormLabel htmlFor="pay-cod" className="font-normal flex-1 cursor-pointer">Cash on Delivery (COD)</FormLabel>
                            </FormItem>
                              {selectedPaymentMethod === 'cod' && (
                                <div className="pl-8 ml-4 pt-2 text-sm text-muted-foreground border-l py-4">Pay cash when your order arrives.</div>
                              )}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage /> {/* For the overall RadioGroup */}
                      </FormItem>
                    )}
                  />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24"> {/* Make summary sticky on large screens */}
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                 <CardDescription>{orderSummary.itemCount} item(s) in your cart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                  {/* --- TODO: List items in summary (optional) --- */}
                  {/* <div className="max-h-40 overflow-y-auto space-y-2 border-b pb-2 mb-2"> Item list goes here </div> */}

                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>₹{orderSummary.shipping.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm">
                  <span>Taxes (Est.)</span>
                  <span>₹{orderSummary.taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-xl">
                  <span>Total</span>
                  <span>₹{orderSummary.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Processing...' : `Place Order (₹${orderSummary.total.toFixed(2)})`}
                </Button>
              </CardFooter>
            </Card>
          </div>

        </form>
      </Form>
    </div>
  );
}
