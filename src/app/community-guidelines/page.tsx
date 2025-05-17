
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, BookOpenCheck, Users, Shield, Edit, Copyright } from 'lucide-react'; // Added more icons

export default function CommunityGuidelinesPage() {
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
            <BookOpenCheck className="h-6 w-6 text-primary"/> AKmax Community Guidelines
          </CardTitle>
          <CardDescription>
            Our rules for maintaining a respectful, safe, and positive community on AKmax (by AK Group 76).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Welcome to AKmax! We want our platform to be a welcoming and inspiring place for everyone. These Community Guidelines define what is and isn't allowed. By using AKmax, you agree to these guidelines and our Terms of Service. Violations may result in content removal, account suspension, or other actions.
          </p>
          
            <h3 className="font-semibold pt-4 border-t text-xl">Guideline Highlights</h3>
            
            <div className="space-y-4">
                <div>
                    <h4 className="font-medium flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Be Respectful</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Treat others as you would like to be treated. We do not tolerate hate speech, harassment, bullying, or threats. Content that promotes violence, discrimination, or disparages individuals or groups based on attributes like race, ethnicity, religion, gender, sexual orientation, disability, or nationality is prohibited.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Shield className="h-5 w-5 text-primary"/>Promote Safety</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Do not share content that encourages or glorifies self-harm, suicide, eating disorders, or dangerous activities. Content depicting sexual exploitation, non-consensual sexual content, or child endangerment is strictly forbidden and will be reported to authorities.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Edit className="h-5 w-5 text-primary"/>Authenticity Matters</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Be yourself. Do not impersonate others or create fake accounts to mislead users. Avoid spam, manipulative practices, or sharing false information that could cause harm.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><Copyright className="h-5 w-5 text-primary"/>Respect Intellectual Property</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Only share content that you have the right to share. Respect copyrights, trademarks, and other legal rights. Do not post content that infringes on someone else's intellectual property.
                    </p>
                </div>
                 <div>
                    <h4 className="font-medium flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-primary"/>Follow the Law</h4>
                    <p className="text-sm text-muted-foreground pl-7">
                        Do not use AKmax for any illegal activities, including the sale of regulated goods, promotion of criminal acts, or sharing of illicit content.
                    </p>
                </div>
            </div>
             <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
                These guidelines are not exhaustive and may be updated. We rely on our community to help us enforce these rules. If you see something that violates our guidelines, please report it. AK Group 76 reserves the right to interpret and enforce these guidelines at its discretion.
             </p>
        </CardContent>
      </Card>
    </div>
  );
}

