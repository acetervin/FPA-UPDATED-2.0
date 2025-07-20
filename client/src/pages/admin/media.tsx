import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminSidebar from '@/components/admin/Sidebar';
import { SectionLoading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { adminApi } from '@/lib/api';

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  type: 'image' | 'document' | 'video';
  size: number;
  uploadedAt: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export default function AdminMedia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState<'all' | 'image' | 'document' | 'video'>('all');
  const { toast } = useToast();

  const { data: media, isLoading } = useQuery<MediaItem[]>({
    queryKey: ['admin', 'media'],
    queryFn: () => adminApi.getMedia(),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => adminApi.uploadMedia(file),
    onSuccess: () => {
      toast({
        title: 'Upload Successful',
        description: 'Your file has been uploaded.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteMedia(id),
    onSuccess: () => {
      toast({
        title: 'Delete Successful',
        description: 'The file has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: 'destructive',
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMedia = media?.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileType === 'all' || item.type === fileType;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Media Library</h2>
                <p className="text-neutral-600">Manage your media files</p>
              </div>
              <div>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileUpload}
                  multiple
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <i className="fas fa-upload mr-2"></i>
                    Upload Files
                  </label>
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="all">All Files</option>
                    <option value="image">Images</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <SectionLoading message="Loading media..." />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMedia?.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      {item.type === 'image' ? (
                        <div className="aspect-video relative group">
                          <img
                            src={item.url}
                            alt={item.filename}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => window.open(item.url, '_blank')}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigator.clipboard.writeText(item.url)}
                            >
                              <i className="fas fa-link"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4">
                          <div className="flex items-center space-x-4">
                            <i className={`fas fa-${item.type === 'document' ? 'file' : 'video'} text-2xl`}></i>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 truncate">
                                {item.filename}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {formatFileSize(item.size)}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <i className="fas fa-ellipsis-v"></i>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                                  <i className="fas fa-eye mr-2"></i> View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.url)}>
                                  <i className="fas fa-link mr-2"></i> Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-error"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <i className="fas fa-trash mr-2"></i> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )}
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
