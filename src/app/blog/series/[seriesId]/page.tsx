
'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Library, PlayCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Series, Episode, BlogPageProps } from '@/types/blog';
import { getSeriesById } from '@/services/blog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const SeriesPage: NextPage<BlogPageProps> = ({ params }) => {
  const seriesId = params?.seriesId;
  const [series, setSeries] = useState<Series | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (seriesId) {
      const fetchSeries = async () => {
        setIsLoading(true);
        try {
          const fetchedSeries = await getSeriesById(seriesId as string);
          setSeries(fetchedSeries);
        } catch (error) {
          console.error("Failed to fetch series:", error);
          // TODO: Show error toast
        }
        setIsLoading(false);
      };
      fetchSeries();
    } else {
        setIsLoading(false);
    }
  }, [seriesId]);

  if (isLoading) {
    return <div className="container mx-auto max-w-4xl py-10 text-center">Loading series details...</div>;
  }

  if (!series) {
    return <div className="container mx-auto max-w-4xl py-10 text-center text-destructive">Series not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </Button>

      <header className="mb-8 space-y-4">
        {series.coverImageUrl && (
          <div className="relative aspect-[16/7] w-full rounded-lg overflow-hidden bg-muted">
            <Image
              src={series.coverImageUrl}
              alt={`Cover image for ${series.title}`}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              data-ai-hint="series cover art wide"
            />
          </div>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{series.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href={`/profile/${series.author.username}`} className="flex items-center gap-2 hover:text-primary">
              <Avatar className="h-8 w-8">
                <AvatarImage src={series.author.avatarUrl} alt={series.author.username} data-ai-hint="author avatar"/>
                <AvatarFallback>{series.author.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{series.author.username}</span>
            </Link>
            <span>·</span>
            <span>{series.episodes.length} Episode{series.episodes.length !== 1 ? 's' : ''}</span>
             {series.genre && ( <><span >·</span><span>{series.genre}</span></>)}
             <span>·</span>
             <span>{series.isCompleted ? "Completed" : "Ongoing"}</span>
        </div>
        {series.description && <p className="text-base text-muted-foreground">{series.description}</p>}
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Library className="mr-2 h-6 w-6 text-primary"/> Episodes
        </h2>
        {series.episodes.length > 0 ? (
            <div className="space-y-4">
                {series.episodes.sort((a,b) => a.episodeNumber - b.episodeNumber).map(episode => (
                    <Card key={episode.id} className="flex flex-col sm:flex-row overflow-hidden">
                        {episode.coverImageUrl && (
                             <div className="relative sm:w-1/3 aspect-video sm:aspect-square flex-shrink-0 bg-muted">
                                <Image
                                    src={episode.coverImageUrl}
                                    alt={episode.title}
                                    fill
                                    style={{objectFit: 'cover'}}
                                    sizes="(max-width: 640px) 100vw, 33vw"
                                    data-ai-hint="episode cover"
                                />
                            </div>
                        )}
                        <div className="flex flex-col flex-grow">
                            <CardHeader>
                                <CardTitle className="text-xl line-clamp-2">Episode {episode.episodeNumber}: {episode.title}</CardTitle>
                                <CardDescription>
                                    Published on {format(new Date(episode.createdAt), 'MMM d, yyyy')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {episode.content.substring(0, 200)}...
                                </p>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button asChild size="sm">
                                    <Link href={`/blog/${episode.id}`}>
                                        <BookOpen className="mr-2 h-4 w-4"/> Read Episode
                                    </Link>
                                </Button>
                                {episode.audioUrl && (
                                     <Button asChild variant="outline" size="sm">
                                        <Link href={`/blog/${episode.id}?playAudio=true`}> {/* Or handle play directly */}
                                            <PlayCircle className="mr-2 h-4 w-4"/> Listen
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No episodes published in this series yet.</p>
        )}
      </section>
    </div>
  );
};

export default SeriesPage;
