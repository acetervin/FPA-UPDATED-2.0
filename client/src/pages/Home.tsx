import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import Counter from "@/components/Counter";
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

export default function Home() {
  const { data: featuredPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
  });

  const { data: activeCauses } = useQuery<Cause[]>({
    queryKey: ["/api/causes/active"],
  });

  return (
    <>
      <Helmet>
        <title>Family Peace Association - Building Stronger Families Together</title>
        <meta name="description" content="Join the Family Peace Association in creating stronger families through counseling, conflict resolution, and community support. Together, we build lasting peace." />
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
                    Together for How You Can Make a 
                    <span className="text-yellow-600"> Difference</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Discover how simple lifestyle changes can contribute to a more sustainable world. Begin your journey towards meaningful change.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/donate">
                    <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-md font-medium">
                      Explore Causes
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollAnimationWrapper>

            {/* Right Image */}
            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
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
                  Embracing Innovation in Environmental Protection
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We combine cutting-edge technology with time-tested conservation methods to create sustainable solutions that benefit both communities and the environment.
                </p>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="slide-up" delay={200}>
              <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">A New Approach to Conservation</h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Our innovative approach combines traditional environmental stewardship with modern technology to create lasting change. 
                    We believe that sustainable practices should be accessible, effective, and empowering for all communities.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Community-Driven:</strong> Locally-led initiatives with global impact</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Science-Based:</strong> Evidence-backed solutions that work</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Technology-Enhanced:</strong> Smart tools for sustainable living</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span><strong>Inclusive:</strong> Solutions that work for everyone, everywhere</span>
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
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
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
                  Environmental challenges require innovative solutions and collective action. We're working to make sustainable practices 
                  accessible and effective for communities worldwide through research, education, and direct action.
                </p>
                
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Research</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Climate Impact Studies</li>
                        <li>• Conservation Strategies</li>
                        <li>• Community Health Research</li>
                        <li>• Biodiversity Protection</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Education</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Environmental Awareness</li>
                        <li>• Sustainable Practices</li>
                        <li>• Youth Programs</li>
                        <li>• Community Workshops</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Action</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Clean Energy Projects</li>
                        <li>• Waste Reduction</li>
                        <li>• Habitat Restoration</li>
                        <li>• Water Conservation</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Technology</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Smart Monitoring</li>
                        <li>• Renewable Energy</li>
                        <li>• Data Analytics</li>
                        <li>• Mobile Solutions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700" 
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
                We bring together the power of science and compassion, combining research-based environmental initiatives with 
                community-centered support programs. Our balanced approach ensures that environmental protection 
                goes hand in hand with social well-being and economic sustainability.
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
                        <img 
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
                <Link href="/donate">
                  <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3">
                    Get Involved Today
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
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