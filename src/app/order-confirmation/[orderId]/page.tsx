
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Home, IndianRupee, FileText } from 'lucide-react';
import Link from 'next/link';

// --- TODO: Fetch Real Order Data ---
// Replace this mock data fetching logic with a call to your backend API
// using the `orderId` from the route parameters.

interface OrderDetails {
  id: string;
  date: string;
  totalAmount: number;
  itemCount: number;
  shippingAddress: { // Simplified address
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  // Add more details like items, tracking number, status etc.
}

const fetchOrderDetails = async (orderId: string): Promise<OrderDetails | null> => {
  console.log(`Fetching details for order: ${orderId}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulate finding an order or returning null
  if (orderId === 'mock-order-123') { // Example valid ID
    return {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN'),
      totalAmount: 241.52, // Matches mock total from checkout
      itemCount: 3,
      shippingAddress: {
        fullName: "Mock User",
        addressLine1: "123 Mock Street",
        city: "Mock City",
        postalCode: "110001",
      },
      paymentMethod: "Credit Card", // Example
    };
  }
  return null; // Order not found
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const loadOrder = async () => {
        setIsLoading(true);
        const data = await fetchOrderDetails(orderId);
        setOrder(data);
        setIsLoading(false);
      };
      loadOrder();
    } else {
        setIsLoading(false);
    }
  }, [orderId]);

  if (isLoading) {
    return <div className="text-center py-20">Loading order confirmation...</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-destructive">Order not found or invalid ID.</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="text-center shadow-lg">
        <CardHeader className="bg-green-50 dark:bg-green-900/20 rounded-t-lg py-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-400">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-1">
            Thank you for your purchase!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Your order <span className="font-semibold text-foreground">#{order.id}</span> has been placed successfully on {order.date}.
            You will receive an email confirmation shortly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm border rounded-md p-4 bg-muted/30">
             <div>
                 <h3 className="font-semibold mb-2 flex items-center gap-1"><Home className="h-4 w-4"/> Shipping To:</h3>
                 <p>{order.shippingAddress.fullName}</p>
                 <p>{order.shippingAddress.addressLine1}</p>
                 <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
             </div>
             <div>
                 <h3 className="font-semibold mb-1 flex items-center gap-1"><IndianRupee className="h-4 w-4"/> Order Summary:</h3>
                 <p>Items: {order.itemCount}</p>
                 <p>Payment: {order.paymentMethod}</p>
                 <p className="font-bold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                  {/* TODO: Add Tracking Link if available */}
                 {/* <p className="mt-2"><Link href="#" className="text-primary hover:underline text-xs">Track your order</Link></p> */}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild>
              <Link href="/store"><Package className="mr-2 h-4 w-4"/> Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile/orders"><FileText className="mr-2 h-4 w-4"/> View My Orders</Link>
               {/* TODO: Create /profile/orders page */}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
