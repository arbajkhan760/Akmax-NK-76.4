'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function AdDashboardPage() {
  // TODO: Fetch real campaign and analytics data

  return (
    <div className="container mx-auto max-w-6xl py-6 space-y-8">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">Ad Dashboard</h1>
          <Button variant="outline" size="sm" asChild>
             <Link href="/promote">← Back to Promotions</Link>
          </Button>
      </div>

      {/* Placeholder for Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Impressions</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">125,430</div><p className="text-xs text-muted-foreground">+5.2% from last period</p></CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Clicks</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">8,120</div><p className="text-xs text-muted-foreground">CTR: 6.47%</p></CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Spend</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">₹ 10,500.00</div><p className="text-xs text-muted-foreground">Across 5 campaigns</p></CardContent>
          </Card>
      </div>

       {/* Placeholder for Charts */}
       <Card>
        <CardHeader><CardTitle>Performance Overview (Placeholder)</CardTitle></CardHeader>
        <CardContent className="h-60 flex items-center justify-center text-muted-foreground bg-muted/30 rounded-md">
           <div className="flex gap-4">
              <LineChart className="h-10 w-10"/>
              <BarChart className="h-10 w-10"/>
              <PieChart className="h-10 w-10"/>
           </div>
            <p className="ml-4">Analytics charts coming soon...</p>
        </CardContent>
       </Card>

        {/* Placeholder for Campaign List */}
        <Card>
            <CardHeader>
                <CardTitle>Campaigns (Placeholder)</CardTitle>
                <CardDescription>Manage your active and past ad campaigns.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center py-8">Campaign management interface coming soon...</p>
                 <div className="text-center mt-4">
                    <Button asChild>
                        <Link href="/ads/create">Create New Campaign</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>

    </div>
  );
}
