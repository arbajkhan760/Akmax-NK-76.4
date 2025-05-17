// src/app/profile/analytics/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription
import { BarChartHorizontalBig, ArrowLeft, Users, Eye, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChartHorizontalBig className="h-7 w-7 text-primary" />
          Content Analytics
        </h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <Card className="text-center">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Insights into your content performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                    <Users className="h-8 w-8 mx-auto text-primary mb-1"/>
                    <p className="text-2xl font-bold">1.5K</p>
                    <p className="text-xs text-muted-foreground">Reach</p>
                </div>
                 <div>
                    <Eye className="h-8 w-8 mx-auto text-primary mb-1"/>
                    <p className="text-2xl font-bold">10.2K</p>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                </div>
                 <div>
                    <Heart className="h-8 w-8 mx-auto text-primary mb-1"/>
                    <p className="text-2xl font-bold">876</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                 <div>
                    <MessageSquare className="h-8 w-8 mx-auto text-primary mb-1"/>
                    <p className="text-2xl font-bold">123</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                </div>
            </div>
          <p className="text-muted-foreground">
            Detailed analytics and graphs coming soon!
          </p>
          <p className="text-xs text-muted-foreground">
            (This is a placeholder page for user content analytics.)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
