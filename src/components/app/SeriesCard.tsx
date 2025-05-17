
'use client';

import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library } from 'lucide-react';
import type { Series } from '@/types/blog';

interface SeriesCardProps {
  series: Series;
}

const SeriesCard: FC<SeriesCardProps> = ({ series }) => {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      {series.coverImageUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={series.coverImageUrl}
            alt={series.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint="series cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{series.title}</CardTitle>
        <CardDescription>
          By {series.author.username} - {series.episodes.length} Episode{series.episodes.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {series.description || "No description available for this series."}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" size="sm" className="w-full">
          <Link href={`/blog/series/${series.id}`}>
            <Library className="mr-2 h-4 w-4" />
            View Series
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SeriesCard;
