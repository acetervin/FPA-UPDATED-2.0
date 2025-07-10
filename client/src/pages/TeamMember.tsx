// Add your TeamMember page code here
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { ArrowLeft, Mail, Linkedin, Heart, Award, Users } from "lucide-react";
import type { TeamMember } from "@shared/schema";

export default function TeamMemberPage() {
  const { slug } = useParams();
  
  const { data: member, isLoading } = useQuery<TeamMember>({
    queryKey: [`/api/team-members/${slug}`],
    enabled: !!slug,
  });

  const { data: allMembers } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="h-8 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-6" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Team Member Not Found</h1>
          <p className="text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
          <Link href="/team">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const otherMembers = allMembers?.filter(m => m.id !== member.id).slice(0, 3) || [];

  return (
    <>
      <Helmet>
        <title>{member.name} - {member.position} | Family Peace Association</title>
        <meta name="description" content={`Meet ${member.name}, ${member.position} at Family Peace Association. ${member.bio.slice(0, 150)}...`} />
      </Helmet>

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <ScrollAnimationWrapper>
            <Link href="/team">
              <Button variant="outline" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </ScrollAnimationWrapper>

          {/* Member Profile */}
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Profile Image and Contact */}
            <ScrollAnimationWrapper animation="slide-in-left">
              <Card className="text-center">
                <CardContent className="p-8">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-64 h-64 rounded-full mx-auto mb-6 object-cover shadow-lg"
                  />
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{member.name}</h1>
                  <p className="text-xl text-primary font-semibold mb-6">{member.position}</p>
                  
                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="flex items-center justify-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </a>
                    )}
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </div>

                  {/* Specialties */}
                  {member.specialties && member.specialties.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                        <Award className="w-5 h-5 mr-2" />
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.map((specialty) => (
                          <span 
                            key={specialty}
                            className="px-3 py-1 primary-bg text-white text-sm rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* Bio and Details */}
            <ScrollAnimationWrapper animation="slide-in-right" className="lg:col-span-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">About {member.name.split(' ')[0]}</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {member.bio}
                  </p>
                </div>

                {/* Additional sections that could be expanded */}
                <div className="mt-12 space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Background</h3>
                    <p className="text-gray-600">
                      {member.name} brings extensive experience in family therapy and community support services. 
                      Their dedication to evidence-based practices and compassionate care makes them an invaluable 
                      member of our team.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Approach to Family Wellness</h3>
                    <p className="text-gray-600">
                      With a focus on {member.specialties?.[0]?.toLowerCase() || 'family support'}, {member.name.split(' ')[0]} 
                      works collaboratively with families to identify strengths, address challenges, and develop 
                      sustainable strategies for long-term relationship health and happiness.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>

      {/* Other Team Members */}
      {otherMembers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Meet Other <span className="primary-text">Team Members</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Discover more of our dedicated professionals working to strengthen families
                </p>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid md:grid-cols-3 gap-8">
              {otherMembers.map((otherMember, index) => (
                <ScrollAnimationWrapper key={otherMember.id} delay={index * 100}>
                  <Card className="card-hover h-full">
                    <CardContent className="p-6 text-center">
                      <img 
                        src={otherMember.imageUrl} 
                        alt={otherMember.name} 
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{otherMember.name}</h3>
                      <p className="text-primary font-medium mb-4">{otherMember.position}</p>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">{otherMember.bio}</p>
                      <Link href={`/team/${otherMember.slug}`}>
                        <Button variant="outline" className="w-full">
                          View Profile
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

      {/* Contact CTA */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Connect with our team to learn more about our services and how we can support your family's journey toward peace and healing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/get-involved">
                  <Button size="lg" variant="outline" className="border-white text-gray-800 hover:bg-white/10">
                    Get Involved
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