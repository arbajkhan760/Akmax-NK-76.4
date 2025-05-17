
'use client'; // Keep if client-side interactions are needed, or remove if page becomes fully static

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, Edit, Shield, Info } from 'lucide-react'; // Added Info here

export default function CopyrightPage() {
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
            <FileText className="h-6 w-6 text-primary"/> AKmax Copyright Policy (AK Group 76)
          </CardTitle>
          <CardDescription>
            Information regarding copyright infringement claims on AKmax. Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <p className="text-sm text-muted-foreground">
            The full Copyright Policy document is currently under development and will be available here soon.
          </p>
          
           <h3 className="font-semibold pt-4 border-t text-xl">Policy Details (Coming Soon)</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-primary"/>Reporting Copyright Infringement</h4>
                     <p className="text-sm text-muted-foreground pl-7">
                        Details on how to report copyright infringement will be provided here.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Edit className="h-5 w-5 text-primary"/>Counter-Notice Procedure</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Information on the counter-notice procedure will be available soon.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/>Repeat Infringer Policy</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Our policy regarding repeat infringers will be detailed here.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Disclaimer</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Important disclaimers related to our copyright policy will be included.
                    </p>
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
                AK Group 76 is committed to protecting intellectual property rights. For inquiries, contact <a href="mailto:akgroup76.com@gmail.com?subject=Copyright Inquiry" className="text-primary hover:underline">akgroup76.com@gmail.com</a>.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}
