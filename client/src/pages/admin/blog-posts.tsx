import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminSidebar from '@/components/admin/Sidebar';
import { SectionLoading } from '@/components/ui/loading';
import { adminApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/admin';

export default function AdminBlogPosts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: blogPosts,
    isLoading,
    error,
    refetch
  } = useQuery<BlogPost[]>({
    queryKey: ['admin', 'blog-posts'],
    queryFn: () => adminApi.getBlogPosts(),
  });

  const filteredPosts = blogPosts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-error text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Blog Posts</h1>
            <p className="text-neutral-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load blog posts'}
            </p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Blog Posts</h2>
                <p className="text-neutral-600">Manage your blog content</p>
              </div>
              <Button>
                <i className="fas fa-plus mr-2"></i>
                New Post
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <Button variant="outline">
                    <i className="fas fa-filter mr-2"></i>
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading blog posts..." />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts?.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="relative">
                      <OptimizedImage
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium
                        ${post.featured ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-600'}`}>
                        {post.featured ? 'Featured' : 'Draft'}
                      </span>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-sm text-neutral-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button variant="ghost" size="sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-error">
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
