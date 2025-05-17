
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { ScanLine, QrCode } from 'lucide-react'; // Using ScanLine for scanner effect

export default function QrPaymentPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Scan QR Code to Pay</h1>
        <p className="text-lg text-gray-300">Accepted all payments</p>
      </div>

      <div className="relative w-64 h-64 sm:w-72 sm:h-72 p-2 bg-white rounded-xl shadow-2xl">
        <Image
          src="https://picsum.photos/seed/akmax_upi_qr/280/280" // Placeholder QR code
          alt="UPI QR Code for arbaj00100@fam"
          width={280}
          height={280}
          className="rounded-lg object-contain"
          data-ai-hint="QR code payment"
        />
        {/* Scanning Frame Corners - Simplified */}
        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
        
        {/* Scanning Line Animation */}
        <div className="absolute inset-x-2 top-2 h-full overflow-hidden">
            <div className="scanner-line absolute left-0 right-0 h-1 bg-primary/70 shadow-[0_0_15px_2px_hsl(var(--primary)/0.5)] rounded-full animate-scan-vertical"></div>
        </div>
      </div>
      <p className="text-sm text-center text-primary font-semibold">UPI ID: arbaj00100@fam</p>


      <Button 
        size="lg" 
        className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-gray-900
                   shadow-[0_0_15px_3px_hsl(var(--primary)/0.5),_0_0_30px_10px_hsl(var(--primary)/0.2)] 
                   hover:shadow-[0_0_20px_5px_hsl(var(--primary)/0.7),_0_0_40px_15px_hsl(var(--primary)/0.3)]"
        onClick={() => alert("QR Scanner functionality would open here.")}
      >
        Scan Now
      </Button>

      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700 text-gray-200 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center text-primary">Promotion Plan Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-center text-gray-300">
            Pay to promote your post, reel, or story instantly. No approval needed. Just scan & get started!
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center space-x-4 pt-6 opacity-70">
        <span className="text-lg font-semibold italic">Triö</span>
        <div className="border-l border-gray-600 h-6"></div>
        {/* Simplified UPI Logo Text */}
        <div className="flex items-center gap-1">
            <QrCode className="h-5 w-5 text-primary"/>
            <span className="font-bold text-lg text-primary">UPI</span>
        </div>
      </div>
       {/* Add keyframes for scanning line animation */}
       <style jsx global>{`
        @keyframes scan-vertical {
          0%, 100% { transform: translateY(0%); }
          50% { transform: translateY(calc(100% - 4px)); } /* Adjust 4px based on line height */
        }
        .animate-scan-vertical {
          animation: scan-vertical 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
