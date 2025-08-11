import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { OptimizedImage } from "@/components/ui/optimized-image";
import SEO from "@/components/SEO";

export default function BlogPost() {
  const { slug } = useParams();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${slug}`],
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog-posts/category/${post?.category}`],
    enabled: !!post?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredRelatedPosts = relatedPosts?.filter(p => p.id !== post.id).slice(0, 3) || [];

  return (
    <>
      <SEO />
      <Helmet>
        <title>{post.title} - Family Peace Association Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <ScrollAnimationWrapper>
            <Link href="/blog">
              <Button variant="outline" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </ScrollAnimationWrapper>

          {/* Article Header */}
          <ScrollAnimationWrapper>
            <header className="max-w-4xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Badge variant="secondary" className="primary-bg text-white">
                  <Tag className="w-3 h-3 mr-1" />
                  {post.category}
                </Badge>
                {/* Remove all references to status, only show badges for events and published */}
                {post.category === 'events' ? (
                  <Badge variant={post.endDate && new Date(post.endDate) > new Date() ? 'default' : 'destructive'} className={post.endDate && new Date(post.endDate) > new Date() ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                    {post.endDate && new Date(post.endDate) > new Date() ? 'Ongoing' : 'Ended'}
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600 text-white">
                    Published
                  </Badge>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                {post.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>

              {post.category === 'events' && (
                <div className="mt-8">
                  {/**     */}
                 {/* <Link href={`/event-registration?name=${encodeURIComponent(post.title)}`}>*/}

                 <a href="https://forms.gle/HT9jg73hPrynaWLu7" target="_blank" rel="noopener noreferrer">
                    <Button size="lg">
                      Register for this Event
                    </Button>
                  </a>
                </div>
              )}
            </header>
          </ScrollAnimationWrapper>

          {/* Featured Image */}
          <ScrollAnimationWrapper animation="scale-in">
            <div className="max-w-4xl mx-auto mb-12">
              <OptimizedImage 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </ScrollAnimationWrapper>

          {/* Article Content */}
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto">
              <MarkdownContent content={post.content} />

              {/* Author Info */}
              <div className="border-t border-gray-200 pt-8 mt-12">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Family Peace Association</h4>
                    <p className="text-sm text-gray-600">Building stronger families together</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </article>

      {/* Related Articles */}
      {filteredRelatedPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Related <span className="primary-text">Articles</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Continue reading more insights on {post.category.toLowerCase()}
                </p>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredRelatedPosts.map((relatedPost, index) => (
                <ScrollAnimationWrapper key={relatedPost.id} delay={index * 100}>
                  <Card className="card-hover overflow-hidden h-full">
                    <OptimizedImage 
                      src={relatedPost.imageUrl} 
                      alt={relatedPost.title} 
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge variant="secondary" className="primary-bg text-white text-xs">
                          {relatedPost.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(relatedPost.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button variant="link" className="primary-text font-semibold p-0">
                          Read More →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Enjoyed This Article?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Subscribe to our newsletter for more insights on building stronger families and creating lasting peace.
              </p>
              <Link href="/blog">
                <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100 mr-4">
                  Read More Articles
                </Button>
              </Link>
              <Link href="/get-involved">
                <Button size="lg" variant="outline" className="border-white text-gray-800 hover:bg-white/10">
                  Get Involved
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
