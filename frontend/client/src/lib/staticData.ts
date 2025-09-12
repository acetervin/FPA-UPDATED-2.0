// Static data loader for serverless content
import { Event } from '@/types/event';
export async function loadStaticData<T>(filename: string): Promise<T> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading static data from ${filename}:`, error);
    throw error;
  }
}

// Static data for events, blog posts, and causes when API is not available
const fallbackEvents = [
  {
    id: '1',
    name: 'Community Outreach Program',
    slug: 'community-outreach-2024',
    description: 'Join us for our monthly community outreach program where we distribute food and clothing to families in need.',
    date: '2024-12-15T10:00:00Z',
    endDate: '2024-12-15T16:00:00Z',
    location: 'Kibera Community Center, Nairobi',
    fee: 0,
    capacity: 100,
    registered: 45,
    imageUrl: 'https://via.placeholder.com/600x400?text=Community+Outreach',
    category: 'Community Service',
    featured: true,
    active: true,
  },
  {
    id: '2',
    name: 'Skills Training Workshop',
    slug: 'skills-training-workshop',
    description: 'Learn valuable skills including computer literacy, tailoring, and small business management.',
    date: '2024-12-20T09:00:00Z',
    endDate: '2024-12-20T17:00:00Z',
    location: 'FPA Training Center, Nairobi',
    fee: 500,
    capacity: 50,
    registered: 32,
    imageUrl: 'https://via.placeholder.com/600x400?text=Skills+Training',
    category: 'Training',
    featured: false,
    active: true,
  },
  {
    id: '3',
    name: 'Youth Empowerment Summit',
    slug: 'youth-empowerment-summit',
    description: 'Empowering young people with leadership skills and career guidance.',
    date: '2024-12-25T08:00:00Z',
    endDate: '2024-12-25T18:00:00Z',
    location: 'University of Nairobi, Nairobi',
    fee: 200,
    capacity: 200,
    registered: 150,
    imageUrl: 'https://via.placeholder.com/600x400?text=Youth+Summit',
    category: 'Empowerment',
    featured: true,
    active: true,
  }
];

const fallbackBlogPosts = [
  {
    id: '1',
    title: 'Making a Difference in Our Community',
    slug: 'making-difference-community',
    excerpt: 'Discover how small actions can create big changes in our local communities.',
    content: 'Our recent community initiatives have shown remarkable results in improving the lives of families in need. Through collaborative efforts and dedicated volunteers, we have been able to provide essential services and support to those who need it most.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Community+Impact',
    authorName: 'FPA Team',
    publishedAt: '2024-12-01T00:00:00Z',
    featured: true,
    tags: ['Community', 'Impact'],
  },
  {
    id: '2',
    title: 'Supporting Education for All',
    slug: 'supporting-education-for-all',
    excerpt: 'Education is the foundation of a better future. Learn about our education initiatives.',
    content: 'Education remains one of the most powerful tools for breaking the cycle of poverty. Our programs focus on providing access to quality education for children from disadvantaged backgrounds.',
    imageUrl: 'https://via.placeholder.com/600x400?text=Education+Support',
    authorName: 'Education Team',
    publishedAt: '2024-11-28T00:00:00Z',
    featured: true,
    tags: ['Education', 'Children'],
  }
];

const fallbackCauses = [
  {
    id: '1',
    title: 'Education Support Program',
    slug: 'education-support-program',
    description: 'Providing educational resources and support to underprivileged children.',
    targetAmount: 100000,
    currentAmount: 45000,
    imageUrl: 'https://via.placeholder.com/600x400?text=Education+Program',
    active: true,
  },
  {
    id: '2',
    title: 'Clean Water Initiative',
    slug: 'clean-water-initiative',
    description: 'Bringing clean and safe drinking water to rural communities.',
    targetAmount: 75000,
    currentAmount: 32000,
    imageUrl: 'https://via.placeholder.com/600x400?text=Clean+Water',
    active: true,
  }
];

// Blog Posts - Fetch directly from database API
export const getBlogPosts = async () => {
  try {
    const response = await fetch('/api/blog-posts');
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return fallbackBlogPosts;
  }
};

export const getFeaturedBlogPosts = async () => {
  // For static deployment, return fallback data directly
  return new Promise((resolve) => {
    setTimeout(() => resolve(fallbackBlogPosts), 100);
  });
};

export const getBlogPostsByCategory = async (category: string) => {
  try {
    const response = await fetch(`/api/blog-posts/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts by category: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    // In a client-only scenario, you might want to filter fallback data or return an empty array if no fallback matches.
    // For simplicity here, we'll return all fallback posts if the API fails.
    return fallbackBlogPosts;
  }
};

export const getBlogPost = async (slug: string) => {
  try {
    const response = await fetch(`/api/blog-posts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch blog post: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    // Find fallback post by slug
    const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
    if (fallbackPost) {
      return fallbackPost;
    }
    throw error;
  }
};

// Gallery
export const getGallery = () => loadStaticData<{images: any[]}>('gallery.json');

export const getGalleryByCategory = async (category: string) => {
  const gallery = await getGallery();
  return {
    images: gallery.images.filter(image => 
      image.category.toLowerCase() === category.toLowerCase()
    )
  };
};

// Active Causes - Fetch directly from database API
export const getActiveCauses = async () => {
  // For static deployment, return fallback data directly
  return new Promise((resolve) => {
    setTimeout(() => resolve(fallbackCauses), 100); // Small delay to simulate API call
  });
};

// Events - Fetch directly from database API
export const getEvents = () => loadStaticData<Event[]>('events.json');

export const getEventBySlug = async (slug: string) => {
  const events = await getEvents();
  return events.find(event => event.slug === slug) || null;
};