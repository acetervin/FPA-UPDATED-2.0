import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import Counter from "@/components/Counter";
import LogoSlider from "@/components/LogoSlider";

import { OptimizedImage } from "@/components/ui/optimized-image";
import SEO from "@/components/SEO";

import { 
  Heart, 
  Users, 
  GraduationCap, 
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Shield
} from "lucide-react";
import type { BlogPost, Cause } from "@shared/schema";
import { getFeaturedBlogPosts, getActiveCauses } from "@/lib/staticData";

export default function Home() {


  const { data: featuredPosts } = useQuery<BlogPost[]>({
    queryKey: ["featured-blog-posts"],
    queryFn: () => getFeaturedBlogPosts(),
  });

  const { data: activeCauses } = useQuery<Cause[]>({
    queryKey: ["active-causes"],
    queryFn: () => getActiveCauses(),
  });

  return (
    <>
      <SEO />
      <Helmet>


        <title>Family Peace Association - Building God-Centered Families</title>
        <meta name="description" content="The Family Peace Association (FPA) is an association of individuals, families and communities that strive to create a peaceful, ideal world through building God-centered families." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-orange-50 pt-24 pb-16 lg:pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]">
            {/* Left Content */}
            <ScrollAnimationWrapper>
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Family Peace Association Kenya (FPA)
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    The Family Peace Association of Kenya (FPA) is an association of individuals, families and communities that strive to create a peaceful, ideal world through building God-centered families.
                  </p>

                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/events">
                    <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-md font-medium">
                      Featured Events
                    </Button> 
                  </Link>
                  <a href="mailto:kenya@familypeaceassociation.org">
                    <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                      Contact Us
                    </Button>
                  </a>
                </div>
              </div>
            </ScrollAnimationWrapper>

            {/* Right Image */}
            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="relative">
                <OptimizedImage 
                  src="https://images.pexels.com/photos/4259140/pexels-photo-4259140.jpeg" 
                  alt="Community volunteers working together"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">50+ Projects</p>
                      <p className="text-sm text-gray-600">Making impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Embracing Innovation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                 Uplifting Humanity Through Spiritual Principles
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                 We aim to elevate human consciousness by grounding it in universal values rooted in God-centered families. Strong, spiritually connected families are the foundation of a thriving society.
                </p>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="slide-up" delay={200}>
              <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">A New Approach to Spiritual Care for Creation </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    We believe strong, God-centered families are the foundation of a loving, thriving society.
                     By aligning with divine principles, we aim to elevate human consciousness and bring lasting peace.
                  </p>
                  <ul className="space-y-3">


                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Inclusive and Universal: </strong> Solutions that work for everyone, everywhere.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Conscious Living Tools:</strong> Tools to strengthen love, understanding, and unity.</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Family-centered:</strong> Initiatives rooted in the sacredness of family, with a global reach.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
              <div className="relative">
                <OptimizedImage 
                  src="https://images.pexels.com/photos/9091896/pexels-photo-9091896.jpeg" 
                  alt="Sustainable farming and environmental protection"
                  className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
              </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Overcoming the Challenges Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimationWrapper>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Overcoming the Challenges
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Families face many obstacles, but with faith, love, and collective effort, they can thrive.
                  We work to support families everywhere by providing guidance, education, and practical tools rooted in divine principles.
                </p>
                
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Research</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Family Well-being Studies</li>
                        <li>• Faith-Based Support Strategies</li>
                        <li>• Community Health and Happiness</li>
                        <li>• Strengthening Bonds and Values</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Education</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Family Values and Principles</li>
                        <li>• Building Love and Understanding</li>
                        <li>• Parenting and Youth Programs</li>
                        <li>• Community Support Workshops</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Action</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Family Healing Initiatives</li>
                        <li>• Relationship Building Activities</li>
                        <li>• Conflict Resolution Resources</li>
                        <li>• Parenting Support Networks</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Technology & Resources</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Faith-Driven Counseling Tools</li>
                        <li>• Family Wellness Apps</li>
                        <li>• Community Support Platforms</li>
                        <li>• Spiritual Growth Resources</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="relative">
                <OptimizedImage 
                  src="https://images.pexels.com/photos/4262424/pexels-photo-4262424.jpeg" 
                  alt="Environmental scientist working in the field"
                  className="w-full h-[600px] object-cover rounded-2xl"
                />
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Balanced Approach Section */}
      <section className="py-20 bg-yellow-600 text-white">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                A Balanced Approach
              </h2>
              <p className="text-xl leading-relaxed mb-8 text-yellow-100">
             We unite the principles of understanding and compassion, blending research-driven support initiatives with community-centered programs. 
             Our balanced approach fosters a God-centered family environment and harmonious communities, ensuring that peace, well-being, and social support grow hand in hand for a brighter, faith-filled future.
             </p>
              <Link href="/about">
                <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3">
                  Learn About Our Approach
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-xl text-gray-600">
                Making a difference through measurable results
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollAnimationWrapper delay={100}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                    <Counter target={2500} suffix="+" className="text-3xl font-bold text-gray-900" />
                    <p className="text-gray-600">Families Helped</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={200}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <Counter target={150} suffix="+" className="text-3xl font-bold text-gray-900" />
                    <p className="text-gray-600">Active Volunteers</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={300}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <Counter target={45} suffix="+" className="text-3xl font-bold text-gray-900" />
                    <p className="text-gray-600">Programs</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={400}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <Counter target={12} suffix="+" className="text-3xl font-bold text-gray-900" />
                    <p className="text-gray-600">Communities Served</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      {(featuredPosts && featuredPosts.length > 0) && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Latest News & Insights
                </h2>
                <p className="text-xl text-gray-600">
                  Stay updated with our latest environmental initiatives and community stories
                </p>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <ScrollAnimationWrapper key={post.id} delay={index * 100}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none cursor-pointer hover:scale-105">
                      <div className="aspect-video bg-gray-200">
                        <OptimizedImage 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-yellow-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="text-yellow-600 font-semibold flex items-center">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimationWrapper>
              ))}
            </div>

            <ScrollAnimationWrapper delay={400}>
              <div className="text-center mt-12">
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="px-8 py-3">
                    View All Articles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl leading-relaxed mb-8 text-yellow-100">
                Join our community of changemakers and start creating positive environmental impact today. 
                Every action counts towards a more sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-involved#initiatives">
                  <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3">
                    Get Involved Today
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-yellow-600 hover:bg-white/10 px-8 py-3">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Partner Logos */}
      <LogoSlider />

      {/* Footer or next section */}
    </>
  );
}
