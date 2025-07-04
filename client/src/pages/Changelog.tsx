import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { 
  Calendar, 
  Plus, 
  Wrench, 
  Bug, 
  ArrowLeft, 
  GitBranch,
  Sparkles,
  Shield
} from "lucide-react";

export default function Changelog() {
  const versions = [
    {
      version: "1.2.0",
      date: "2024-12-20",
      type: "major",
      title: "Enhanced Community Features",
      changes: [
        {
          type: "feature",
          description: "Added volunteer application system with form validation and email notifications"
        },
        {
          type: "feature", 
          description: "Implemented newsletter subscription with double opt-in confirmation"
        },
        {
          type: "feature",
          description: "Added contact form with automated routing to appropriate departments"
        },
        {
          type: "improvement",
          description: "Enhanced mobile navigation with improved touch interactions"
        },
        {
          type: "improvement",
          description: "Optimized image loading with lazy loading and WebP format support"
        },
        {
          type: "fix",
          description: "Fixed theme persistence across browser sessions"
        }
      ]
    },
    {
      version: "1.1.5",
      date: "2024-12-15",
      type: "minor",
      title: "Performance & Accessibility Updates",
      changes: [
        {
          type: "improvement",
          description: "Improved website performance with code splitting and optimized bundles"
        },
        {
          type: "improvement",
          description: "Enhanced accessibility with proper ARIA labels and keyboard navigation"
        },
        {
          type: "improvement",
          description: "Added skip navigation links for screen readers"
        },
        {
          type: "fix",
          description: "Fixed color contrast issues in dark theme mode"
        },
        {
          type: "fix",
          description: "Resolved scroll animation performance on mobile devices"
        }
      ]
    },
    {
      version: "1.1.0",
      date: "2024-12-10", 
      type: "major",
      title: "Content Management & Blog System",
      changes: [
        {
          type: "feature",
          description: "Launched comprehensive blog system with categories and search functionality"
        },
        {
          type: "feature",
          description: "Added team member profiles with individual detail pages"
        },
        {
          type: "feature",
          description: "Implemented causes/programs showcase with progress tracking"
        },
        {
          type: "improvement",
          description: "Enhanced SEO optimization with meta tags and Open Graph support"
        },
        {
          type: "improvement",
          description: "Added social media integration and sharing capabilities"
        }
      ]
    },
    {
      version: "1.0.5",
      date: "2024-12-05",
      type: "patch",
      title: "Security & Bug Fixes",
      changes: [
        {
          type: "security",
          description: "Updated all dependencies to latest secure versions"
        },
        {
          type: "security",
          description: "Implemented Content Security Policy (CSP) headers"
        },
        {
          type: "fix",
          description: "Fixed form validation error messages not displaying correctly"
        },
        {
          type: "fix",
          description: "Resolved mobile menu closing issues on iOS devices"
        },
        {
          type: "improvement",
          description: "Improved error handling and user feedback messages"
        }
      ]
    },
    {
      version: "1.0.0",
      date: "2024-12-01",
      type: "major",
      title: "Initial Launch",
      changes: [
        {
          type: "feature",
          description: "Complete website launch with responsive design"
        },
        {
          type: "feature",
          description: "Implemented dual theme system (Golden Harmony & Serene Blue)"
        },
        {
          type: "feature",
          description: "Added smooth scroll animations and micro-interactions"
        },
        {
          type: "feature",
          description: "Created comprehensive service pages and information architecture"
        },
        {
          type: "feature",
          description: "Integrated contact forms and volunteer signup functionality"
        },
        {
          type: "feature",
          description: "Established brand identity and visual design system"
        }
      ]
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "improvement":
        return <Sparkles className="w-4 h-4 text-blue-600" />;
      case "fix":
        return <Bug className="w-4 h-4 text-orange-600" />;
      case "security":
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Wrench className="w-4 h-4 text-gray-600" />;
    }
  };

  const getVersionBadge = (type: string) => {
    switch (type) {
      case "major":
        return <Badge className="bg-green-100 text-green-800">Major Release</Badge>;
      case "minor":
        return <Badge variant="secondary">Minor Update</Badge>;
      case "patch":
        return <Badge variant="outline">Patch</Badge>;
      default:
        return <Badge variant="outline">Release</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Changelog - Family Peace Association</title>
        <meta name="description" content="Track the latest updates, improvements, and new features added to the Family Peace Association website. Version history and development progress." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                <GitBranch className="w-12 h-12 inline mr-4" />
                Changelog
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Track our progress and stay updated with the latest features, improvements, and fixes to our website and services.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="primary-bg w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Continuous Improvement</h2>
                      <p className="text-gray-600 mb-4">
                        We're constantly working to improve our website and services to better serve families in our community. 
                        This changelog documents all the updates, new features, bug fixes, and improvements we've made over time.
                      </p>
                      <p className="text-gray-600">
                        We follow semantic versioning (Major.Minor.Patch) to clearly communicate the scope of changes in each release.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Version History */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Version <span className="primary-text">History</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Detailed breakdown of all releases and updates to our platform.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {versions.map((version, index) => (
                <ScrollAnimationWrapper key={version.version} delay={index * 100}>
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <CardTitle className="text-2xl font-bold text-gray-800">
                            v{version.version}
                          </CardTitle>
                          {getVersionBadge(version.type)}
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(version.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-lg text-gray-700 mt-2">{version.title}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {version.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getChangeIcon(change.type)}
                            </div>
                            <div className="flex-grow">
                              <span className="text-gray-700">{change.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Change Types Legend */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Change <span className="primary-text">Types</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the different types of changes we make to improve your experience.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                type: "feature",
                icon: <Plus className="w-6 h-6 text-green-600" />,
                title: "New Features",
                description: "Brand new functionality and capabilities added to the website",
                color: "border-green-200 bg-green-50"
              },
              {
                type: "improvement",
                icon: <Sparkles className="w-6 h-6 text-blue-600" />,
                title: "Improvements",
                description: "Enhancements to existing features and overall user experience",
                color: "border-blue-200 bg-blue-50"
              },
              {
                type: "fix",
                icon: <Bug className="w-6 h-6 text-orange-600" />,
                title: "Bug Fixes",
                description: "Resolution of issues and problems to ensure smooth operation",
                color: "border-orange-200 bg-orange-50"
              },
              {
                type: "security",
                icon: <Shield className="w-6 h-6 text-red-600" />,
                title: "Security",
                description: "Updates to enhance security and protect user data",
                color: "border-red-200 bg-red-50"
              }
            ].map((item, index) => (
              <ScrollAnimationWrapper key={item.type} delay={index * 100}>
                <Card className={`text-center h-full ${item.color} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Future Updates */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                What's <span className="primary-text">Next?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We're always working on new features and improvements. Here's what's coming up in future releases.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Planned Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Upcoming Features</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span>Online appointment booking system</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span>Resource library with downloadable materials</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span>Community forum for peer support</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span>Multilingual support</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Planned Improvements</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Enhanced mobile app-like experience</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Advanced search and filtering capabilities</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Personalized content recommendations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Improved analytics and user insights</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Want to be notified about new updates and features? Subscribe to our newsletter or follow us on social media.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
