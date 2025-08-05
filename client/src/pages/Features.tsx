import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { 
  Heart, 
  Handshake, 
  Users, 
  GraduationCap, 
  Phone, 
  Calendar, 
  Shield, 
  Award,
  CheckCircle,
  Clock,
  MapPin,
  Headphones
} from "lucide-react";
import SEO from "@/components/SEO";

export default function Features() {
  return (
    <>
      <SEO />
      <Helmet>
        <title>Our Services & Features - Family Peace Association</title>
        <meta name="description" content="Discover our comprehensive family support services including counseling, conflict resolution, support groups, and educational workshops designed to strengthen relationships." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Our <span className="primary-text">Services</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Comprehensive family support services designed to strengthen relationships, resolve conflicts, and build lasting peace in your home.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Core <span className="primary-text">Services</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our evidence-based programs are designed to meet families where they are and support them on their journey toward healing and growth.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: Heart,
                title: "Family Counseling",
                description: "Professional therapeutic services for families facing challenges in communication, trust, and relationship dynamics.",
                features: [
                  "Individual and family therapy sessions",
                  "Trauma-informed care approaches",
                  "Evidence-based therapeutic methods",
                  "Culturally sensitive support"
                ],
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              },
              {
                icon: Handshake,
                title: "Conflict Resolution",
                description: "Mediation and training services to help families resolve disputes peacefully and build stronger communication skills.",
                features: [
                  "Family mediation services",
                  "Conflict resolution workshops",
                  "Communication skills training",
                  "Preventive intervention strategies"
                ],
                image: "https://images.unsplash.com/photo-1554734867-bf3c00a49371?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              },
              {
                icon: Users,
                title: "Support Groups",
                description: "Peer-led support groups providing community connection and shared experiences for families on similar journeys.",
                features: [
                  "Weekly support group meetings",
                  "Peer mentorship programs",
                  "Topic-specific support circles",
                  "Safe space for sharing experiences"
                ],
                image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              },
              {
                icon: GraduationCap,
                title: "Educational Workshops",
                description: "Interactive learning experiences focused on building practical skills for healthy family relationships.",
                features: [
                  "Parenting skills workshops",
                  "Communication techniques training",
                  "Stress management courses",
                  "Relationship building seminars"
                ],
                image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              }
            ].map((service, index) => (
              <ScrollAnimationWrapper key={service.title} delay={index * 200}>
                <Card className="overflow-hidden h-full">
                  <OptimizedImage 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="accent-bg w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose <span className="primary-text">Our Services</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to providing the highest quality support with features designed around your family's needs.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Confidential & Safe",
                description: "All services provided in a confidential, judgment-free environment"
              },
              {
                icon: Award,
                title: "Expert Team",
                description: "Licensed professionals with specialized training in family therapy"
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Evening and weekend appointments available to fit your schedule"
              },
              {
                icon: MapPin,
                title: "Multiple Locations",
                description: "Convenient locations throughout the community"
              },
              {
                icon: Phone,
                title: "24/7 Crisis Support",
                description: "Emergency support line available for urgent situations"
              },
              {
                icon: Calendar,
                title: "Ongoing Support",
                description: "Long-term support programs for sustained family growth"
              },
              {
                icon: Users,
                title: "Family-Centered",
                description: "Services designed to strengthen the entire family unit"
              },
              {
                icon: Headphones,
                title: "Multilingual Services",
                description: "Support available in multiple languages and cultural contexts"
              }
            ].map((feature, index) => (
              <ScrollAnimationWrapper key={feature.title} delay={index * 100}>
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="primary-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                How Our <span className="primary-text">Process Works</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We follow a structured approach to ensure every family receives the personalized support they need.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Initial Consultation",
                  description: "We begin with a comprehensive assessment to understand your family's unique situation, challenges, and goals. This confidential consultation helps us develop a personalized plan.",
                  duration: "60-90 minutes"
                },
                {
                  step: "02", 
                  title: "Customized Plan Development",
                  description: "Based on your consultation, our team creates a tailored intervention plan that may include therapy sessions, workshops, support groups, or crisis intervention services.",
                  duration: "Ongoing planning"
                },
                {
                  step: "03",
                  title: "Active Intervention & Support",
                  description: "We implement your personalized plan with regular sessions, check-ins, and adjustments as needed. Our team provides ongoing support throughout your journey.",
                  duration: "Variable timeline"
                },
                {
                  step: "04",
                  title: "Long-term Maintenance",
                  description: "We provide continued support and resources to help maintain the positive changes in your family relationships. Follow-up sessions and community connections ensure lasting success.",
                  duration: "Ongoing support"
                }
              ].map((step, index) => (
                <ScrollAnimationWrapper key={step.step} delay={index * 200}>
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="primary-bg w-16 h-16 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{step.step}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                        <span className="text-sm text-primary font-medium">{step.duration}</span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </ScrollAnimationWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Begin Your Family's Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Take the first step toward building stronger relationships and creating lasting peace in your home. Our team is here to support you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    Schedule Consultation
                  </Button>
                </Link>
                <Link href="/get-involved">
                  <Button size="lg" variant="outline" className="border-white text-gray-800 hover:bg-white/10">
                    Learn More
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
