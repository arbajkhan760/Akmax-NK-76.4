
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Link as LinkIcon, Copy, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const affiliateLinkSchema = z.object({
  originalUrl: z.string().url({ message: "Please enter a valid URL." }),
});

// --- TODO: Affiliate Link Generation Logic ---
// Replace this with your actual link generation logic.
// This function should take the original URL and return a unique
// affiliate link for the current user.
const generateAffiliateLink = (originalUrl: string, userId: string): string => {
  const encodedUrl = encodeURIComponent(originalUrl);
  const affiliateId = btoa(`${userId}-${Date.now()}`).replace(/=/g, ''); // Simple unique ID generation
  // Example format: https://akreels.com/link?ref=[USER_ID]&via=[AFFILIATE_ID]&target=[ENCODED_URL]
  // Adjust the domain and parameters as needed for your backend tracking.
  return `https://ak-reels-example.com/a/${affiliateId}?target=${encodedUrl}`;
};

// --- TODO: User Authentication ---
// Replace this with your actual user ID retrieval mechanism.
const getCurrentUserId = (): string => {
  // In a real app, get this from session, auth context, etc.
  return "user123";
};

export default function AffiliatePage() {
  const { toast } = useToast();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = getCurrentUserId(); // Get the user ID

  const form = useForm<z.infer<typeof affiliateLinkSchema>>({
    resolver: zodResolver(affiliateLinkSchema),
    defaultValues: {
      originalUrl: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof affiliateLinkSchema>) => {
    setIsLoading(true);
    setGeneratedLink(null); // Clear previous link
    console.log('Original URL:', values.originalUrl);

    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const affiliateLink = generateAffiliateLink(values.originalUrl, userId);
      setGeneratedLink(affiliateLink);
      toast({
        title: 'Affiliate Link Generated!',
        description: 'You can now copy and share your link.',
      });
    } catch (error) {
      console.error("Error generating link:", error);
      toast({
        variant: 'destructive',
        title: 'Failed to Generate Link',
        description: 'An error occurred. Please check the URL and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink).then(() => {
        toast({ title: 'Link Copied!' });
      }).catch(err => {
        console.error('Failed to copy:', err);
        toast({ variant: 'destructive', title: 'Failed to Copy Link' });
      });
    }
  };

  const shareLink = () => {
    if (navigator.share && generatedLink) {
      navigator.share({
        title: 'Check out this product!', // Customize share title
        text: 'Found something interesting via AK Reels:', // Customize share text
        url: generatedLink,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else if (generatedLink) {
      // Fallback for browsers that don't support navigator.share
      copyToClipboard();
       toast({ description: 'Share feature not supported. Link copied instead.' });
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
       <Button variant="outline" size="sm" asChild className="mb-4">
           <Link href="/store">← Back to Store</Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Generate Affiliate Link</CardTitle>
          <CardDescription>
            Paste a product link from any website to generate your unique affiliate link.
            Earn a commission (min. 20%) when someone buys through your link!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="originalUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Product URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://example-store.com/product-page" {...field} />
                         <Button type="submit" disabled={isLoading}>
                           {isLoading ? 'Generating...' : <ArrowRight className="h-4 w-4"/>}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {generatedLink && (
            <Card className="mt-6 bg-muted/50">
              <CardHeader>
                 <CardTitle className="text-lg">Your Affiliate Link</CardTitle>
                 <CardDescription>Share this link to earn commissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Input readOnly value={generatedLink} className="text-sm font-mono bg-background" />
              </CardContent>
              <CardFooter className="gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                 <Button onClick={shareLink} size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
         <CardFooter className="text-xs text-muted-foreground border-t pt-4">
             Commissions are tracked automatically. Check your earnings in the 'My Earnings' section.
             Minimum 20% commission on successful purchases via your links.
         </CardFooter>
      </Card>
    </div>
  );
}
