import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Mail, Linkedin, Heart } from "lucide-react";
import type { TeamMember } from "@shared/schema";

export default function Team() {
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  return (
    <>
      <Helmet>
        <title>Our Team - Family Peace Association</title>
        <meta name="description" content="Meet the dedicated professionals and volunteers working to strengthen families and build peaceful communities through expert guidance and compassionate care." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Meet Our <span className="primary-text">Team</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Our dedicated team of professionals and volunteers work tirelessly to support families and strengthen communities through evidence-based interventions and compassionate care.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <ScrollAnimationWrapper key={member.id} delay={index * 100}>
                  <Card className="card-hover h-full">
                    <CardContent className="p-6 text-center">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-32 h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
                      />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                      <p className="text-primary font-semibold mb-4">{member.position}</p>
                      <p className="text-gray-600 mb-6 line-clamp-3">{member.bio}</p>
                      
                      {/* Specialties */}
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {member.specialties.map((specialty) => (
                              <span 
                                key={specialty}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contact Links */}
                      <div className="flex justify-center space-x-4 mb-6">
                        {member.email && (
                          <a 
                            href={`mailto:${member.email}`}
                            className="text-gray-400 hover:text-primary transition-colors"
                            title={`Email ${member.name}`}
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a 
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-primary transition-colors"
                            title={`${member.name} on LinkedIn`}
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>

                      <Link href={`/team/${member.slug}`}>
                        <Button variant="outline" className="w-full">
                          View Full Profile
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </ScrollAnimationWrapper>
              ))}
            </div>
          ) : (
            <ScrollAnimationWrapper>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Building Our Team</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  We're actively growing our team of dedicated professionals. Check back soon to meet the amazing people working to strengthen families in our community.
                </p>
                <Link href="/get-involved">
                  <Button className="primary-bg text-white">
                    Join Our Team
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
          )}
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Are you passionate about strengthening families and building peaceful communities? We're always looking for dedicated professionals and volunteers to join our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-involved">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    Volunteer With Us
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
