
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use next/navigation for App Router
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, MessageSquare, Star, UserCircle, CheckCircle, Minus, Plus } from 'lucide-react'; // Added icons, Minus, Plus
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// --- TODO: Fetch Real Product Data ---
// Replace this mock data fetching logic with a call to your backend API
// using the `productId` from the route parameters.

interface ProductDetails {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number; // Use number for calculations
  stock: number;
  category: string;
  seller: {
    username: string;
    avatarUrl: string;
    isVerified: boolean; // Example seller detail
    rating: number; // Example seller rating
    joinDate: string; // Example join date
  };
  // Add other relevant details like reviews, specifications etc.
}

// Mock data (used if fetch fails or for initial render) - Made prices deterministic
const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: `prod-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/product${i + 1}/600/400`, // Adjusted aspect ratio slightly
  title: `Product Title ${i + 1}`,
  description: `This is a great product description for item ${i + 1}. High quality and affordable, perfect for your needs. Includes features A, B, and C. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  price: ((i + 1) * 13.75 + 10).toFixed(2), // Deterministic price
  stock: Math.floor((i + 1) * 7.3) % 100, // Deterministic stock
  category: ['Electronics', 'Fashion', 'Beauty', 'Books', 'Fitness', 'Home'][i % 6],
  sellerUsername: `seller_${(i % 3) + 1}`, // Added seller username for consistency
}));


const fetchProductDetails = async (productId: string): Promise<ProductDetails | null> => {
   console.log(`Fetching details for product: ${productId}`);
   // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 700));

   // Find mock product or return null if not found (replace with real fetch)
   const mockProduct = mockProducts.find(p => p.id === productId);
   if (!mockProduct) return null;

    // Simulate fetching seller details based on product ID pattern
    const productIndex = parseInt(productId.split('-')[1]) || 1;
    const sellerIndex = (productIndex - 1) % 3 + 1;
    const sellerDetails = {
        username: `seller_${sellerIndex}`,
        avatarUrl: `https://picsum.photos/id/${10 + sellerIndex}/50`,
        isVerified: (productIndex + sellerIndex) % 2 === 0, // Deterministic verification
        rating: (3.5 + (productIndex % 15) / 10).toFixed(1), // Deterministic rating between 3.5 and 4.9
        joinDate: `Joined Aug ${2022 + (productIndex % 3)}`, // Deterministic join date
   };

   return {
       ...mockProduct,
       price: parseFloat(mockProduct.price), // Convert price string to number
       seller: sellerDetails,
       // Ensure stock matches the mock data generation
       stock: Math.floor((productIndex) * 7.3) % 100,
   };
};


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.productId as string; // Get productId from route params
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

   useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        setIsLoading(true);
        const data = await fetchProductDetails(productId);
        setProduct(data);
        setIsLoading(false);
      };
      loadProduct();
    } else {
        setIsLoading(false); // No ID, stop loading
    }
  }, [productId]);

   const handleAddToCart = () => {
     if (!product || product.stock < quantity) {
         toast({ variant: 'destructive', title: 'Cannot Add to Cart', description: 'Product is out of stock or insufficient quantity.' });
         return;
     }
     console.log(`Adding ${quantity} of ${product.title} (ID: ${product.id}) to cart.`);
     // --- TODO: Implement Add to Cart Logic ---
     // 1. Call backend API to add the item to the user's cart.
     // 2. Provide user feedback (e.g., toast notification).
     toast({
         title: 'Added to Cart!',
         description: `${quantity} x ${product.title} added to your cart.`,
         action: <Button variant="link" size="sm" asChild><Link href="/cart">View Cart</Link></Button>
     });
   };

   const incrementQuantity = () => {
       if (product && quantity < product.stock) {
          setQuantity(q => q + 1);
       }
   }
    const decrementQuantity = () => {
       if (quantity > 1) {
          setQuantity(q => q - 1);
       }
   }

  if (isLoading) {
     return <div className="text-center py-20">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-destructive">Product not found.</div>;
  }

  return (
    <div className="space-y-8">
       <Button variant="outline" size="sm" asChild className="mb-4">
           <Link href="/store">← Back to Store</Link>
        </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-muted">
             <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                style={{ objectFit: 'contain' }} // Use contain to show full image
                sizes="(max-width: 768px) 100vw, 50vw"
                priority // Load main image faster
                data-ai-hint={`${product.category} product detail`}
            />
           </div>
            {/* TODO: Add Thumbnail Gallery if multiple images */}
        </Card>

        {/* Product Details & Actions */}
        <div className="space-y-6">
           <Card>
             <CardHeader>
                 <CardTitle className="text-3xl font-bold">{product.title}</CardTitle>
                 <CardDescription className="text-sm text-muted-foreground pt-1">
                    Category: <Link href={`/store?category=${product.category}`} className="text-primary hover:underline">{product.category}</Link>
                 </CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <p className="text-3xl font-extrabold text-primary">₹{product.price.toFixed(2)}</p>
                 <p className="text-base">{product.description}</p>
                 <div className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                 <div className="flex items-center gap-4">
                    <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
                    <div className="flex items-center border rounded-md">
                       <Button variant="ghost" size="icon" className="h-8 w-8 border-r" onClick={decrementQuantity} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
                       <Input
                         id="quantity"
                         type="number"
                         value={quantity}
                         readOnly // Use buttons to change value
                         className="h-8 w-12 text-center border-none focus-visible:ring-0"
                        />
                       <Button variant="ghost" size="icon" className="h-8 w-8 border-l" onClick={incrementQuantity} disabled={quantity >= product.stock}><Plus className="h-4 w-4" /></Button>
                    </div>
                 </div>
                )}
             </CardContent>
             <CardFooter>
                 <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.stock <= 0}>
                   <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
             </CardFooter>
          </Card>

           {/* Seller Information */}
           <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                 <Avatar className="h-12 w-12 border">
                    <AvatarImage src={product.seller.avatarUrl} alt={product.seller.username} />
                    <AvatarFallback><UserCircle className="h-6 w-6"/></AvatarFallback>
                 </Avatar>
                 <div className="text-sm">
                    <div className="flex items-center gap-1">
                       <Link href={`/profile/${product.seller.username}`} className="font-semibold hover:underline">{product.seller.username}</Link>
                        {product.seller.isVerified && <CheckCircle className="h-4 w-4 text-blue-500" title="Verified Seller"/>}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                        <span>{product.seller.rating} Rating</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{product.seller.joinDate}</p>
                 </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <MessageSquare className="mr-2 h-4 w-4"/> Contact Seller
                 </Button>
              </CardContent>
           </Card>

            {/* TODO: Reviews/Ratings Section */}
            {/* <Card>
               <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
               <CardContent>
                   <p className="text-muted-foreground">Reviews coming soon.</p>
               </CardContent>
            </Card> */}
        </div>
      </div>


    </div>
  );
}
