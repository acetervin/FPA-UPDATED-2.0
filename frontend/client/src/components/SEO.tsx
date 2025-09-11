import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}

export default function SEO({
  title = "Family Peace Association | Family, Peace, Wellbeing",
  description = "Family Peace Association promotes family wellbeing, peace, and support. Learn more about family, peace, and how to build stronger families. Join our events, donate, and access resources for family and peace.",
  keywords = "family, family peace, peace, family peace association, wellbeing, support, donate, events, counseling, conflict resolution, parenting, relationships, marriage, children, mental health, community, nonprofit, charity",
  url = "https://www.familypeaceassociation.org/",
  image = "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Family Peace Association" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
}
