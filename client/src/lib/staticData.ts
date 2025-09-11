// Static data loader for serverless content
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
    throw error;
  }
};

export const getFeaturedBlogPosts = async () => {
  try {
    const response = await fetch('/api/blog-posts/featured');
    if (!response.ok) {
      throw new Error(`Failed to fetch featured posts: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    throw error;
  }
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
    throw error;
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
  try {
    const response = await fetch('/api/causes/active');
    if (!response.ok) {
      throw new Error(`Failed to fetch active causes: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching active causes:', error);
    throw error;
  }
};

// Events - Fetch directly from database API
export const getEvents = async () => {
  try {
    const response = await fetch('/api/events');
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventBySlug = async (slug: string) => {
  try {
    const response = await fetch(`/api/events/by-slug/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch event: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    throw error;
  }
};