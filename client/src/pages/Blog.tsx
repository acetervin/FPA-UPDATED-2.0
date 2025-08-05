import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Search, Calendar, Tag } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import SEO from "@/components/SEO";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useLocation();

  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Handle URL parameters for category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const categories = blogPosts 
    ? Array.from(new Set(blogPosts.map(post => post.category))) 
    : [];

  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <>
      <SEO />
      <Helmet>
        <title>Blog - Family Peace Association</title>
        <meta name="description" content="Read our latest articles on family wellness, conflict resolution, and building stronger relationships. Expert insights and practical advice for families." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Family Wellness <span className="text-yellow-600">Blog</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Expert guidance, practical tips, and inspiring stories to help you build stronger family relationships and create lasting peace in your home.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    onClick={() => {
                      setSelectedCategory("");
                      // Remove category from URL
                      const newUrl = new URL(window.location.href);
                      newUrl.searchParams.delete('category');
                      window.history.pushState({}, '', newUrl.toString());
                    }}
                    size="sm"
                  >
                    All Categories
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCategory(category);
                        // Update URL with new category
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.set('category', category);
                        window.history.pushState({}, '', newUrl.toString());
                      }}
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              {searchTerm || selectedCategory ? (
                <p className="text-gray-600">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              ) : null}
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4" />
                    <div className="h-6 bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <ScrollAnimationWrapper>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Articles Found</h3>
                <p className="text-gray-600 mb-8">
                  We couldn't find any articles matching your search criteria. Try adjusting your search terms or browse all categories.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </ScrollAnimationWrapper>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <ScrollAnimationWrapper key={post.id} delay={index * 100}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="card-hover overflow-hidden h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105">
                      <OptimizedImage 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center space-x-2 mb-4">
                          <Badge variant="secondary" className="bg-yellow-600 text-white">
                            <Tag className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                          {post.category === 'events' ? (
                            <Badge variant={post.endDate && new Date(post.endDate) > new Date() ? 'secondary' : 'destructive'} className={post.endDate && new Date(post.endDate) > new Date() ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}>
                              {post.endDate && new Date(post.endDate) > new Date() ? 'Ongoing' : 'Ended'}
                            </Badge>
                          ) : null}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="text-yellow-600 font-semibold mt-auto">
                          Read More →
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimationWrapper>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-yellow-600">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Stay Updated with Our Latest Articles
              </h2>
              <p className="text-xl text-yellow-100 mb-8">
                Subscribe to our newsletter and never miss our latest insights on family wellness and relationship building.
              </p>
              <Link href="#newsletter">
                <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
                  Subscribe to Newsletter
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
