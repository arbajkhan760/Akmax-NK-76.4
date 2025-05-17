
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, QrCode, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// Mock current user data
const MOCK_USERNAME = 'ak_group_76_official';
const MOCK_PROFILE_URL = `https://akmax.app/profile/${MOCK_USERNAME}`; // Replace with actual app URL
const MOCK_QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(MOCK_PROFILE_URL)}`;


export default function ProfileQrPage() {
  const { toast } = useToast();

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = MOCK_QR_CODE_URL + "&format=png"; 
    link.download = `${MOCK_USERNAME}_akmax_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'QR Code Downloading...', description: 'Check your downloads folder.' });
  };

  const handleShareQR = async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      toast({ variant: 'destructive', title: 'Sharing Not Supported', description: 'Cannot share in this environment.' });
      return;
    }

    const shareData = {
      title: `My AKmax Profile: ${MOCK_USERNAME}`,
      text: `Connect with me on AKmax! Scan my QR code or visit my profile: ${MOCK_PROFILE_URL}`,
      url: MOCK_PROFILE_URL,
    };

    const tryCopyToClipboard = async (fallbackMessage?: string) => {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(MOCK_PROFILE_URL);
          toast({ title: 'Profile Link Copied!', description: fallbackMessage || "Link copied to clipboard." });
        } catch (copyError) {
          console.error('Fallback copy to clipboard failed:', copyError);
          toast({ variant: 'destructive', title: 'Copy Failed', description: "Could not copy the link to clipboard." });
        }
      } else {
        toast({ variant: 'destructive', title: 'Action Not Supported', description: 'Cannot share or copy link in this browser.' });
      }
    };

    if (navigator.share) {
      if (!window.isSecureContext) {
        toast({
          variant: "destructive",
          title: "Sharing Unavailable",
          description: "Web Share API requires a secure (HTTPS) connection. Trying to copy link instead.",
          duration: 7000,
        });
        await tryCopyToClipboard("Link copied as sharing requires HTTPS.");
        return;
      }

      try {
        await navigator.share(shareData);
        toast({ title: 'Profile QR Shared!' });
      } catch (error: any) {
        console.error('Error sharing QR:', error);
        if (error.name === 'AbortError') {
          toast({ variant: "destructive", title: "Sharing Cancelled", description: "You cancelled the share operation." });
        } else if (error.name === 'NotAllowedError') {
          toast({
            variant: "destructive",
            title: "Sharing Permission Denied",
            description: "Sharing permission was denied or the action was not allowed by the browser. Trying to copy link instead.",
            duration: 7000,
          });
          await tryCopyToClipboard("Link copied as sharing was not allowed.");
        } else {
          toast({
            variant: "destructive",
            title: "Sharing Failed",
            description: "Could not share the QR code. Trying to copy link instead.",
            duration: 7000,
          });
          await tryCopyToClipboard("Link copied as sharing failed.");
        }
      }
    } else if (navigator.clipboard) {
      toast({ title: "Share API Not Available", description: "Copying link to clipboard instead." });
      await tryCopyToClipboard();
    } else {
      toast({ variant: 'destructive', title: 'Action Not Supported', description: 'Cannot share or copy link in this browser.' });
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Button variant="outline" size="sm" asChild>
        <Link href="/settings">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
        </Link>
      </Button>
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <QrCode className="h-7 w-7 text-primary" />
            My AKmax QR Code
          </CardTitle>
          <CardDescription>Share this QR code to let others easily find and follow your AKmax profile.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="p-4 bg-card border rounded-lg shadow-md inline-block">
             <Image
                src={MOCK_QR_CODE_URL}
                alt={`${MOCK_USERNAME}'s AKmax QR Code`}
                width={200}
                height={200}
                priority
                data-ai-hint="profile QR code"
             />
          </div>
          <p className="font-semibold text-lg">@{MOCK_USERNAME}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 border-t pt-6">
            <Button onClick={handleDownloadQR} variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Download QR
            </Button>
            <Button onClick={handleShareQR} className="w-full sm:w-auto">
                 <Share2 className="mr-2 h-4 w-4" /> Share QR
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
