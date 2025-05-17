
import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react'; // Added Eye icon for View Details
import Link from 'next/link';

interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  sellerUsername: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0 relative aspect-video">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          data-ai-hint={`${product.category} product`} // Use category for hint
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{product.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-2">{product.description}</CardDescription>
        <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-primary">₹{product.price}</span>
             <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
               {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Sold by: {product.sellerUsername}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button size="sm" className="flex-1" disabled={product.stock <= 0}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
         <Button size="sm" variant="outline" asChild>
             <Link href={`/store/product/${product.id}`}>
               <Eye className="mr-2 h-4 w-4" /> View
            </Link>
         </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
