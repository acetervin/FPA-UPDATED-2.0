import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Users, Target, Award } from "lucide-react";
import type { TeamMember } from "@shared/schema";

export default function About() {
  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  return (
    <>
      <Helmet>
        <title>About Us - Family Peace Association</title>
        <meta name="description" content="Learn about our mission, values, and the dedicated team working to build stronger families and create lasting peace in communities." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Who We Are
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The Family Peace Association (FPA) is an association of individuals, families and communities that strive to create a peaceful, ideal world through building God-centered families.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Why the Family Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why the Family?</h2>
              <p className="text-lg text-gray-600 mb-8">
                The family is the most basic of all social units that addresses our most essential physical, emotional and spiritual needs.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                The Family Peace Association seeks to enlighten humanity by uplifting our spiritual consciousness through universal principles and values rooted in God-centered families.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-8">
                A world of peace through God-centered families.
              </p>
              <p className="text-md text-gray-500">For more information: <a href="mailto:kenya@familypeaceassociation.org" className="text-primary underline">kenya@familypeaceassociation.org</a></p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our <span className="primary-text">Values</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core values guide everything we do and shape how we serve families in our community.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Compassion",
                description: "We approach every family with empathy, understanding, and genuine care for their wellbeing."
              },
              {
                icon: Users,
                title: "Community",
                description: "We believe in the power of community support and collaborative healing."
              },
              {
                icon: Target,
                title: "Excellence",
                description: "We strive for the highest standards in our programs and services."
              },
              {
                icon: Award,
                title: "Integrity",
                description: "We operate with transparency, honesty, and ethical principles in all we do."
              }
            ].map((value, index) => (
              <ScrollAnimationWrapper key={value.title} delay={index * 100}>
                <Card className="card-hover h-full text-center">
                  <CardContent className="p-6">
                    <div className="accent-bg w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slide-in-left">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Family counseling session" 
                className="rounded-xl shadow-lg w-full"
              />
            </ScrollAnimationWrapper>
            
            <ScrollAnimationWrapper animation="slide-in-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Our <span className="primary-text">History</span>
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2015 - Foundation</h3>
                    <p className="text-gray-600">
                      Founded by Dr. Sarah Johnson with a vision to provide accessible family counseling and conflict resolution services to underserved communities.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2018 - Expansion</h3>
                    <p className="text-gray-600">
                      Expanded our programs to include educational workshops and community outreach initiatives, reaching over 500 families in our first three years.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2021 - Growth</h3>
                    <p className="text-gray-600">
                      Launched our volunteer training program and established partnerships with local schools, healthcare providers, and social services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2024 - Today</h3>
                    <p className="text-gray-600">
                      Now serving over 2,500 families with a team of dedicated professionals and volunteers, continuing to expand our impact in the community.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
      {teamMembers && teamMembers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Meet Our <span className="primary-text">Team</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Our dedicated team of professionals and volunteers work tirelessly to support families and strengthen communities.
                </p>
                <Link href="/team">
                  <Button className="primary-bg text-white hover:opacity-90">
                    View Full Team
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.slice(0, 3).map((member, index) => (
                <ScrollAnimationWrapper key={member.id} delay={index * 100}>
                  <Card className="card-hover text-center">
                    <CardContent className="p-6">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                      <p className="text-primary font-medium mb-4">{member.position}</p>
                      <p className="text-gray-600 text-sm">{member.bio.slice(0, 120)}...</p>
                      <Link href={`/team/${member.slug}`}>
                        <Button variant="link" className="primary-text mt-4">
                          Learn More
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

      {/* Call to Action */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join us in our mission to build stronger families and create lasting peace in our communities. Whether through volunteering, partnerships, or spreading awareness, every contribution matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-involved">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    Get Involved
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
