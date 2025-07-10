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
                Who <span className="primary-text">we are</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The family peace association (FPA) is an association of individuals, families, and communities that strive to create a peaceful, ideal world through building God-centered families.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slide-in-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Our <span className="primary-text">Mission</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  The Family Peace Association is dedicated to enlightening humanity by uplifting our spiritual consciousness through universal principles and values rooted in God-centered families. We believe that healthy families are the foundation of a thriving society.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Through evidence-based therapeutic interventions, educational programs, and community support networks, we empower families to overcome challenges and build lasting bonds of love, understanding, and respect.
                </p>
                <Link href="/get-involved">
                  <Button className="primary-bg text-white hover:opacity-90">
                    Join Our Mission
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slide-in-right">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Community support group meeting" 
                className="rounded-xl shadow-lg w-full"
              />
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-3xl mx-auto">
             </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Mission Section (Text Right, Image Left) */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimationWrapper animation="slide-in-left">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Community support group meeting" 
                className="rounded-xl shadow-lg w-full"
              />
            </ScrollAnimationWrapper>
            <ScrollAnimationWrapper animation="slide-in-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Our <span className="primary-text">Vision</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  A world of peace through God-centered families.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  We aspire to build communities rooted in love, respect, and spiritual growth, where families are empowered to create lasting peace for generations to come.
                </p>
                <Link href="/get-involved">
                  <Button className="primary-bg text-white hover:opacity-90">
                    Join Us
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our <span className="primary-text">Programs</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                Explore our diverse programs that empower families, nurture character, and promote peace in our communities.
                </p>
                </div>
                </ScrollAnimationWrapper>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <Card className="h-full">
                <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">Family Peace & Character Education Initiative </h3>
                <p className="text-gray-600 mb-4">Workshops and resources focused on building character, fostering empathy, and nurturing peaceful relationships within families.</p>
                </CardContent>
                </Card>
                <Card className="h-full">
                <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">Women Outreach and Family Education Program</h3>
                <p className="text-gray-600 mb-4">Empowering women through outreach, education, and support to strengthen families and promote community well-being.</p>
                </CardContent>
                </Card>
                <Card className="h-full">
                <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">Youth Mentorship & Marriage Preparation</h3>
                <p className="text-gray-600 mb-4">Guidance and mentorship for youth and young adults to prepare for healthy relationships and successful marriages.</p>
                </CardContent>
                </Card>
                <Card className="h-full">
                <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">Mens Fellowship Academy For Family</h3>
                <p className="text-gray-600 mb-4">A supportive community for men to develop leadership, parenting, and relationship skills for strong families.</p>
                </CardContent>
                </Card>
                <Card className="h-full">
                <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">Faith & Values Seminars</h3>
                <p className="text-gray-600 mb-4">Seminars exploring universal values and spiritual principles to inspire personal growth and family harmony.</p>
                </CardContent>
                </Card>
                <Card className="h-full">
                <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">Couples Marriage Enrichment Program</h3>
                <p className="text-gray-600 mb-4">Programs and workshops designed to help couples deepen their connection, improve communication, and enrich their marriages.</p>
                </CardContent>
              </Card>
              </div>
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
