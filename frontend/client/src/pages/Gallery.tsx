import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import ScrollAnimationWrapper from "../components/ScrollAnimationWrapper";
import { OptimizedImage } from "../components/ui/optimized-image";
import SEO from "../components/SEO";
import { getGallery } from "../lib/staticData";
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
    getGallery()
      .then(data => {
        setImages(data.images || []);
      })
      .catch(err => {
        console.error("Gallery Error:", err);
        setError(err.message || 'Failed to load images. The gallery might be empty or the server is unavailable.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const filteredImages = selectedCategory === 'All Categories'
    ? images
    : images.filter(img => img.category.toLowerCase() === selectedCategory.toLowerCase());

  // Don't group by category when showing all categories - create masonry layout
  const shouldShowMasonry = selectedCategory === 'All Categories';

  const slides = filteredImages.map(({ imageUrl, title, description }) => ({
    src: imageUrl,
    title,
    description,
  }));

  return (
    <>
      {/* Modern Category Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
          {CATEGORY_LIST.map((cat, index) => (
            <button
              key={cat}
              className={`group relative px-6 py-3 rounded-full border-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-400/25 scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200/50 hover:bg-yellow-50 hover:border-yellow-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedCategory(cat)}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <span className="relative z-10">
                {cat === 'All Categories' && '🎯 '}
                {cat === 'Character Education' && '📚 '}
                {cat === 'Women Empowerment' && '💪 '}
                {cat === 'Youth Mentorship' && '🌟 '}
                {cat === 'Couples Enrichment' && '💑 '}
                {cat === 'Men Fellowship' && '🤝 '}
                {cat === 'Other' && '✨ '}
                {cat}
              </span>
              
              {/* Hover Ring Effect */}
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400/0 group-hover:border-yellow-400/30 transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100"></div>
              
              {/* Active State Glow */}
              {selectedCategory === cat && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-20 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
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
        ) : shouldShowMasonry ? (
          /* Masonry Layout for All Categories */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 [column-gap:1.5rem]">
            {filteredImages.map((img, index) => (
              <ScrollAnimationWrapper key={img.imageUrl + index} delay={index * 50}>
                <div
                  className="break-inside-avoid-column inline-block w-full mb-6 cursor-pointer group"
                  onClick={() => {
                    setIndex(index);
                    setOpen(true);
                  }}
                >
                  <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
                    <OptimizedImage
                      src={img.imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-300"
                    />
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        ) : (
          /* Regular Grid for Specific Categories */
          <div className="columns-1 sm:columns-2 lg:columns-3 [column-gap:1.5rem]">
            {filteredImages.map((img, index) => (
              <ScrollAnimationWrapper key={img.imageUrl + index} delay={index * 50}>
                <div
                  className="break-inside-avoid-column inline-block w-full mb-6 cursor-pointer group"
                  onClick={() => {
                    setIndex(index);
                    setOpen(true);
                  }}
                >
                  <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
                    <OptimizedImage
                      src={img.imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-300"
                    />
                  </div>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
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
  { url: 'https://www.youtube.com/live/GNbZLrxfRqs', title: 'Interview with Kamba Tv' },
  { url: 'https://www.youtube.com/watch?v=w5i2qdmAD7s', title: 'Couples Enrichment Workshop' },
];

const getYouTubeVideoId = (url: string) => {
  const videoIdMatch = url.match(/(?:watch\?v=|live\/)([\w-]+)/);
  return videoIdMatch ? videoIdMatch[1] : '';
};

const getYouTubeThumbnail = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

const VideosGallery: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handlePlayVideo = (videoUrl: string) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      // Open YouTube video in new tab
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Our Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videoData.map((video, index) => {
          const thumbnailUrl = getYouTubeThumbnail(video.url);
          return (
            <ScrollAnimationWrapper key={video.url + index} delay={index * 100}>
              <div className="group cursor-pointer" onClick={() => handlePlayVideo(video.url)}>
                <div className="relative overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                  {/* Video Thumbnail Background */}
                  <div className="aspect-video relative">
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Dark Overlay for Better Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/40"></div>
                    
                    {/* Animated Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Expanding Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full border-2 border-white/30 animate-ping animation-delay-0"></div>
                          <div className="absolute w-16 h-16 rounded-full border-2 border-white/20 animate-ping animation-delay-300"></div>
                          <div className="absolute w-12 h-12 rounded-full border-2 border-white/10 animate-ping animation-delay-600"></div>
                        </div>
                        
                        {/* Main Play Button */}
                        <div className="relative w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                          <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-b-[8px] border-t-transparent border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          );
        })}
      </div>
      
      {/* Add custom CSS for animation delays */}
      <style>{`
        .animation-delay-0 {
          animation-delay: 0s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
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
      
      {/* Modern Tab Switcher */}
      <div className="flex justify-center mb-16">
        <div className="relative bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-white/20">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('images')}
              className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                activeTab === 'images'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/25 scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <span className="relative z-10">📸 Images</span>
              {activeTab === 'images' && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl animate-pulse opacity-20"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-400/25 scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <span className="relative z-10">🎥 Videos</span>
              {activeTab === 'videos' && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl animate-pulse opacity-20"></div>
              )}
            </button>
          </div>
        </div>
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
