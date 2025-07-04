import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import Counter from "@/components/Counter";
import { 
  Heart, 
  Handshake, 
  Users, 
  GraduationCap, 
  ChevronDown,
  Hospital,
  School,
  Scale,
  HandHeart,
  Star
} from "lucide-react";
import type { BlogPost, Cause } from "@shared/schema";

export default function Home() {
  const { data: featuredPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/featured"],
  });

  const { data: activeCauses } = useQuery<Cause[]>({
    queryKey: ["/api/causes/active"],
  });

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Family Peace Association - Building Stronger Families Together</title>
        <meta name="description" content="Join the Family Peace Association in creating stronger families through counseling, conflict resolution, and community support. Together, we build lasting peace." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 parallax-bg" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <ScrollAnimationWrapper animation="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Building Peace,<br />
              <span className="primary-text">Healing Families</span>
            </h1>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper animation="slide-up" delay={200}>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Join us in creating stronger families through counseling, conflict resolution, and community support. Together, we build lasting peace.
            </p>
          </ScrollAnimationWrapper>
          
          <ScrollAnimationWrapper animation="slide-up" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved">
                <Button size="lg" className="primary-bg text-white hover:opacity-90">
                  Explore Our Programs
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30"
                onClick={scrollToServices}
              >
                Learn More
              </Button>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper animation="fade-in" delay={600}>
            <p className="text-sm mt-6 opacity-75">
              Press 'Explore Our Programs' to confirm your acceptance of the{" "}
              <Link href="/legal">
                <a className="underline">Terms of Service</a>
              </Link>
              .
            </p>
          </ScrollAnimationWrapper>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white text-2xl" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Discover Our <span className="primary-text">Services</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We offer comprehensive family support services designed to strengthen relationships and promote lasting peace in your home.
              </p>
              <Link href="/features">
                <Button className="primary-bg text-white hover:opacity-90">
                  View All Services
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Family Counseling",
                description: "Professional guidance to strengthen family bonds through communication, understanding, and therapeutic intervention."
              },
              {
                icon: Handshake,
                title: "Conflict Resolution",
                description: "Mediation services and training to help families resolve disputes peacefully and build stronger relationships."
              },
              {
                icon: Users,
                title: "Support Groups",
                description: "Community-based support groups providing peer connection and shared experiences for healing and growth."
              },
              {
                icon: GraduationCap,
                title: "Educational Workshops",
                description: "Interactive workshops on communication skills, parenting strategies, and relationship building techniques."
              }
            ].map((service, index) => (
              <ScrollAnimationWrapper key={service.title} delay={index * 100}>
                <Card className="card-hover h-full">
                  <CardContent className="p-6 text-center">
                    <div className="accent-bg w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slide-in-left">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Healing Families, <span className="primary-text">One Step at a Time</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  A thorough understanding of family dynamics, informed by evidence-based practices and compassionate care, is essential for developing targeted and effective strategies that address the most urgent relationship challenges.
                </p>
                <div className="space-y-4">
                  {[
                    "Evidence-based therapeutic approaches",
                    "Culturally sensitive family support",
                    "Community-centered healing programs"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="primary-bg w-2 h-2 rounded-full" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Family counseling session" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                  alt="Family reading together" 
                  className="rounded-xl shadow-lg w-full h-auto mt-8"
                />
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Empowering Families for a <span className="text-white/90">Peaceful Tomorrow</span>
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Join us in the vital mission to strengthen family bonds and create lasting peace. Your involvement is crucial in ensuring healthier relationships for future generations.
              </p>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Assessment & Support",
                description: "Compassionate evaluation of family dynamics and individual needs"
              },
              {
                number: "02",
                title: "Therapeutic Intervention",
                description: "Evidence-based counseling and conflict resolution strategies"
              },
              {
                number: "03",
                title: "Ongoing Support",
                description: "Continued guidance and community support for lasting change"
              }
            ].map((step, index) => (
              <ScrollAnimationWrapper key={step.number} delay={index * 200}>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/90">{step.description}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { target: 95, suffix: "%", title: "Success Rate", description: "Our family counseling programs consistently achieve a 95% success rate in improving family relationships." },
              { target: 2500, suffix: "", title: "Families Helped", description: "We've positively impacted over 2,500 families through our targeted interventions and support programs." },
              { target: 92, suffix: "%", title: "Volunteer Retention", description: "We proudly maintain a 92% volunteer retention rate, showcasing our strong community of committed supporters." },
              { target: 98, suffix: "%", title: "Satisfaction Rating", description: "Our services have earned a 98% satisfaction rating from the families and communities we work with." }
            ].map((stat, index) => (
              <ScrollAnimationWrapper key={stat.title} delay={index * 100}>
                <div className="text-center">
                  <Counter 
                    target={stat.target} 
                    suffix={stat.suffix}
                    className="primary-text text-5xl font-bold mb-2"
                  />
                  <div className="text-xl font-semibold text-gray-800 mb-1">{stat.title}</div>
                  <p className="text-gray-600">{stat.description}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      {activeCauses && activeCauses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Our Latest <span className="primary-text">Volunteer Opportunities</span>
                </h2>
              </div>
            </ScrollAnimationWrapper>
            
            <div className="grid md:grid-cols-2 gap-8">
              {activeCauses.slice(0, 2).map((cause, index) => (
                <ScrollAnimationWrapper key={cause.id} delay={index * 200}>
                  <Card className="card-hover h-full">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-2xl font-bold text-gray-800 mb-2">
                            ${cause.goalAmount.toLocaleString()}
                          </div>
                          <div className="text-lg text-gray-600 mb-2">
                            ${cause.raisedAmount.toLocaleString()} raised
                          </div>
                        </div>
                        <div className="primary-bg text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {Math.round((cause.raisedAmount / cause.goalAmount) * 100)}%
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{cause.title}</h3>
                      <p className="text-gray-600 mb-6">{cause.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{cause.volunteersNeeded} volunteers needed</span>
                        <Link href={`/causes/${cause.slug}`}>
                          <Button className="primary-bg text-white hover:opacity-90">
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Partnering with over <span className="primary-text">1,200 organizations</span> to create change.
              </h2>
            </div>
          </ScrollAnimationWrapper>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {[
              { icon: Hospital, label: "Healthcare Partners" },
              { icon: School, label: "Educational Institutions" },
              { icon: Scale, label: "Legal Services" },
              { icon: HandHeart, label: "Community Organizations" },
              { icon: Heart, label: "Mental Health Providers" }
            ].map((partner, index) => (
              <ScrollAnimationWrapper key={partner.label} delay={index * 100}>
                <div className="text-center">
                  <partner.icon className="w-12 h-12 text-gray-400 mb-2 mx-auto" />
                  <p className="text-sm text-gray-500">{partner.label}</p>
                </div>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                content: "The Family Peace Association has transformed our family. Their counseling program helped us rebuild trust and communication. We're forever grateful.",
                author: "Emily Rodriguez",
                role: "Program Participant",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b134?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
              },
              {
                content: "Volunteering here has been one of the most rewarding experiences of my life. The dedication to making a real difference is evident in everything they do.",
                author: "Michael Davis",
                role: "Volunteer",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
              },
              {
                content: "This organization has truly transformed lives. It's amazing to see how every resource is directed toward families in need and building stronger communities.",
                author: "John Roy",
                role: "Community Outreach Coordinator",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
              }
            ].map((testimonial, index) => (
              <ScrollAnimationWrapper key={testimonial.author} delay={index * 200}>
                <Card className="card-hover h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6">{testimonial.content}</p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  Building Stronger <span className="primary-text">Families</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Expert guidance for family wellness. Specialized support for healthy relationships.
                </p>
                <Link href="/blog">
                  <Button className="primary-bg text-white hover:opacity-90">
                    More Articles
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <ScrollAnimationWrapper key={post.id} delay={index * 200}>
                  <Card className="card-hover overflow-hidden h-full">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="primary-bg text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="link" className="primary-text font-semibold p-0">
                          Read More →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
