import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";
import SEO from "@/components/SEO";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// --- TYPE DEFINITIONS ---
interface GalleryImage {
  imageUrl: string;
  title: string;
  description?: string;
  category: string;
  uploadedAt?: string;
}

interface VideoItem {
  url: string;
  title: string;
}

// --- IMAGE GALLERY COMPONENT ---
const CATEGORY_LIST = [
  'All Categories',
  'Character Education',
  'Women Empowerment',
  'Youth Mentorship',
  'Couples Enrichment',
  'Men Fellowship',
  'Other',
];

const ImagesGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

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

  const filteredImages = selectedCategory === 'All Categories'
    ? images
    : images.filter(img => img.category.toLowerCase() === selectedCategory.toLowerCase());

  const imagesByCategory = filteredImages.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  const slides = filteredImages.map(({ imageUrl, title, description }) => ({
    src: imageUrl,
    title,
    description,
  }));

  return (
    <>
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

      {/* Gallery Grid */}
      <div>
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
              {selectedCategory === 'All Categories' && (
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">{category}</h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {imgs.map((img, index) => {
                  const globalIndex = filteredImages.findIndex(i => i.imageUrl === img.imageUrl);
                  return (
                    <ScrollAnimationWrapper key={img.imageUrl + index} delay={index * 100}>
                      <div
                        className="overflow-hidden rounded-lg shadow-lg aspect-w-4 aspect-h-3 cursor-pointer"
                        onClick={() => {
                          if (globalIndex !== -1) {
                            setIndex(globalIndex);
                            setOpen(true);
                          }
                        }}
                      >
                        <OptimizedImage
                          src={img.imageUrl}
                          alt={img.title || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      {img.title && <div className="mt-2 text-center font-medium">{img.title}</div>}
                      {img.description && <div className="text-center text-gray-500 text-sm">{img.description}</div>}
                    </ScrollAnimationWrapper>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
      />
    </>
  );
};

// --- VIDEO GALLERY COMPONENT ---
const videoData: VideoItem[] = [
//  { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Inspiring Change in the Community' },
//  { url: 'https://www.youtube.com/watch?v=3JZ_D3p_elo', title: 'Youth Mentorship Program Highlights' },
 // { url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0', title: 'A Look at Our Women Empowerment Initiative' },
 // { url: 'https://www.youtube.com/watch?v=QH2-TGUlwu4', title: 'Family Peace Festival 2023' },
//  { url: 'https://www.youtube.com/watch?v=8ybW48rKBME', title: 'Volunteer Stories: Making a Difference' },
  { url: 'https://www.youtube.com/watch?v=w5i2qdmAD7s', title: 'Couples Enrichment Workshop' },
];

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:v=)([\w-]+)/);
  if (!videoIdMatch) return '';
  return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
};

const VideosGallery: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Our Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videoData.map((video, index) => (
          <ScrollAnimationWrapper key={video.url + index} delay={index * 100}>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={getYouTubeEmbedUrl(video.url)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            {video.title && <div className="mt-2 text-center font-medium">{video.title}</div>}
          </ScrollAnimationWrapper>
        ))}
      </div>
    </div>
  );
};


// --- MAIN GALLERY PAGE COMPONENT ---
const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  return (
    <>
      <SEO />
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
      
      {/* Main Tab Switcher */}
      <div className="flex justify-center mb-10 gap-4">
        <button
          onClick={() => setActiveTab('images')}
          className={`px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300 ${
            activeTab === 'images'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-300 ${
            activeTab === 'videos'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Content Section */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          {activeTab === 'images' ? <ImagesGallery /> : <VideosGallery />}
        </div>
      </section>
    </>
  );
};

export default Gallery;
