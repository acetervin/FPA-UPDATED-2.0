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

// Blog Posts
export const getBlogPosts = () => loadStaticData<any[]>('blog-posts.json');

export const getFeaturedBlogPosts = () => loadStaticData<any[]>('featured-posts.json');

export const getBlogPostsByCategory = async (category: string) => {
  const posts = await getBlogPosts();
  return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

export const getBlogPost = async (slug: string) => {
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug) || null;
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

// Active Causes
export const getActiveCauses = () => loadStaticData<any[]>('active-causes.json');

// Events
export const getEvents = () => loadStaticData<any[]>('events.json');

export const getEventBySlug = async (slug: string) => {
  const events = await getEvents();
  return events.find(event => event.slug === slug) || null;
};