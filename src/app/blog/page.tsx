
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'; // Added React for Fragment
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { BookOpen, Edit, FileText, TrendingUp, Library, FilePenLine, FileClock, ShieldAlert } from 'lucide-react';
import type { Story, Series } from '@/types/blog';
import { getPublishedStories, getPublishedSeries, getPendingReviewStoryBooks } from '@/services/blog';
import SeriesCard from '@/components/app/SeriesCard';

// Define Ad Placeholder Card for Blog Home
const AdPlaceholderBlogCard: React.FC = () => (
  <Card className="col-span-1 flex flex-col items-center justify-center h-full border rounded-lg p-4 bg-muted/30 text-muted-foreground shadow-sm">
    <p className="font-semibold text-lg">Ad Placeholder</p>
    <p className="text-sm">Google AdMob - Native Ad</p>
  </Card>
);

const BlogHomePage: NextPage = () => {
  const [articles, setArticles] = useState<Story[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [pendingReviewBooks, setPendingReviewBooks] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedArticles, fetchedSeries, fetchedPendingBooks] = await Promise.all([
          getPublishedStories(),
          getPublishedSeries(),
          getPendingReviewStoryBooks(),
        ]);
        setArticles(fetchedArticles);
        setSeries(fetchedSeries);
        setPendingReviewBooks(fetchedPendingBooks);
      } catch (error) {
        console.error("Failed to fetch blog content:", error);
        // TODO: Show error toast
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <BookOpen className="mr-3 h-8 w-8 text-primary" />
          Our Articles & Series
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/blog/publish">
              <FilePenLine className="mr-2 h-4 w-4" /> Write New Article/Story
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog/drafts">
              <FileText className="mr-2 h-4 w-4" /> My Drafts
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog/earnings">
              <TrendingUp className="mr-2 h-4 w-4" /> My Earnings
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading content...</div>
      ) : (
        <>
          {/* Books Pending Review Section */}
          {pendingReviewBooks.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <FileClock className="mr-2 h-6 w-6 text-yellow-500" /> Books Pending Review
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingReviewBooks.map((book) => (
                  <Card key={book.id} className="flex flex-col overflow-hidden h-full border-yellow-500/50">
                    {book.coverImageUrl && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={book.coverImageUrl}
                          alt={book.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          data-ai-hint="book cover pending"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                      <CardDescription>By {book.author.username} - <span className="text-yellow-600 font-medium">Pending Review</span></CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {book.content.substring(0, 150)}...
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={`/blog/${book.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Published Series Section */}
          {series.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Library className="mr-2 h-6 w-6 text-primary" /> Featured Series
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {series.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <SeriesCard series={s} />
                    {/* Insert ad placeholder after every 2 series for example */}
                    {(index + 1) % 2 === 0 && <AdPlaceholderBlogCard />}
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}

          {/* Standalone Published Articles Section */}
          {articles.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-primary" /> Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((story, index) => (
                  <React.Fragment key={story.id}>
                    <Card className="flex flex-col overflow-hidden h-full">
                      {story.coverImageUrl && (
                        <div className="relative aspect-video w-full">
                          <Image
                            src={story.coverImageUrl}
                            alt={story.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            data-ai-hint="story cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                        <CardDescription>By {story.author.username}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {story.content.substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/blog/${story.id}`}>Read Article</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                    {/* Insert ad placeholder after every 2 articles for example */}
                    {(index + 1) % 2 === 0 && <AdPlaceholderBlogCard />}
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}

          {!isLoading && articles.length === 0 && series.length === 0 && pendingReviewBooks.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
              <p className="mb-4">Be the first to publish an article or story on AK Reels!</p>
              <Button asChild>
                <Link href="/blog/publish">
                  <FilePenLine className="mr-2 h-4 w-4" /> Start Writing
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogHomePage;
