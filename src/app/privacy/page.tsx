
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Lock, FileText, Users, Share2, ShieldCheck, Info } from 'lucide-react'; // Added more icons

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
       <Button variant="outline" size="sm" asChild className="mb-6">
           <Link href="/settings">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
           </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
             <Lock className="h-6 w-6 text-primary"/> AKmax Privacy Policy (AK Group 76)
          </CardTitle>
          <CardDescription>
            How AK Group 76 collects, uses, and protects your information when you use AKmax. Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            AK Group 76 ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AKmax mobile application and services (collectively, "Services").
          </p>
          
            <h3 className="font-semibold pt-4 border-t text-xl">Key Information</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Information We Collect</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        We may collect personal information you provide directly to us, such as your name, username, email address, phone number, profile picture, and content you create or share. We also collect information automatically when you use our Services, including usage data, device information, IP address, and location information (if you grant permission).
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>How We Use Your Information</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        We use your information to provide, maintain, and improve our Services; personalize your experience; communicate with you; ensure security; comply with legal obligations; and for analytics and research purposes.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Share2 className="h-5 w-5 text-primary"/>Information Sharing</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our Services, with your consent, for legal reasons (e.g., to comply with a subpoena), or in connection with a merger or acquisition. Publicly shared content on AKmax is visible to other users according to your privacy settings.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Lock className="h-5 w-5 text-primary"/>Your Privacy Choices and Rights</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        You may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. You can manage your privacy settings within the AKmax app. For more detailed requests, please contact us.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary"/>Data Security and Retention</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        We implement reasonable security measures to protect your information. We retain your data for as long as necessary to provide our Services and fulfill the purposes outlined in this policy, or as required by law.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Children's Privacy</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        AKmax is not intended for children under the age of 13 (or the relevant minimum age in your jurisdiction). We do not knowingly collect personal information from children without parental consent.
                    </p>
                </div>
                <div>
                    <h4 className="font-medium flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Policy Updates</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
                    </p>
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
               If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:akgroup76.com@gmail.com" className="text-primary hover:underline">akgroup76.com@gmail.com</a>.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}
