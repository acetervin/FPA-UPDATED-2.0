import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface GalleryImage {
  imageUrl: string;
  title: string;
  description?: string;
  category: string;
  uploadedAt?: string;
}

const CATEGORY_LIST = [
  'All Categories',
  'Character Education',
  'Women Empowerment',
  'Youth Mentorship',
  'Couples Enrichment',
  'Men Fellowship',
  
];

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch images');
        return res.json();
      })
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter images by selected category
  const filteredImages = selectedCategory === 'All Categories'
    ? images
    : images.filter(img => img.category.toLowerCase() === selectedCategory.toLowerCase());

  // Group filtered images by category (for sectioned display)
  const imagesByCategory = filteredImages.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  return (
    <>
      <Helmet>
        <title>Gallery - Family Peace Association</title>
        <meta name="description" content="Explore moments from our events, programs, and community work. See the impact of our mission in action." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Our <span className="primary-text">Gallery</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A glimpse into our journey of building stronger families and fostering peace within the community.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-md border font-medium transition-colors duration-200 ${
              selectedCategory === cat
                ? 'bg-yellow-400 text-black border-yellow-400 shadow'
                : 'bg-white text-black border-gray-200 hover:bg-yellow-100'
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading"></span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center text-gray-500">No images found for this category.</div>
          ) : (
            Object.entries(imagesByCategory).map(([category, imgs]) => (
              <div key={category} className="mb-16">
                {/* Only show category heading if not filtering to a single category */}
                {selectedCategory === 'All Categories' && (
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">{category}</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {imgs.map((img, index) => (
                    <ScrollAnimationWrapper key={img.imageUrl + index} delay={index * 100}>
                      <div className="overflow-hidden rounded-lg shadow-lg aspect-w-4 aspect-h-3">
                        <OptimizedImage 
                          src={img.imageUrl} 
                          alt={img.title || `Gallery image ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      {img.title && <div className="mt-2 text-center font-medium">{img.title}</div>}
                      {img.description && <div className="text-center text-gray-500 text-sm">{img.description}</div>}
                    </ScrollAnimationWrapper>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;
