import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Users, Heart, Target, TrendingUp } from "lucide-react";
import type { Cause } from "@shared/schema";

export default function Causes() {
  const { data: causes, isLoading } = useQuery<Cause[]>({
    queryKey: ["/api/causes"],
  });

  const activeCauses = causes?.filter(cause => cause.active) || [];
  const totalGoal = causes?.reduce((sum, cause) => sum + cause.goalAmount, 0) || 0;
  const totalRaised = causes?.reduce((sum, cause) => sum + cause.raisedAmount, 0) || 0;
  const totalVolunteersNeeded = causes?.reduce((sum, cause) => sum + cause.volunteersNeeded, 0) || 0;

  return (
    <>
      <Helmet>
        <title>Our Causes - Family Peace Association</title>
        <meta name="description" content="Discover our family peace initiatives and programs designed to strengthen relationships, resolve conflicts, and build lasting community support." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Our <span className="primary-text">Causes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Explore our family peace initiatives and programs designed to strengthen relationships, resolve conflicts, and build lasting support in our communities.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Impact Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our <span className="primary-text">Impact</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Together, we're making a meaningful difference in the lives of families across our community.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: "Total Goal",
                value: `$${totalGoal.toLocaleString()}`,
                description: "Combined fundraising target"
              },
              {
                icon: TrendingUp,
                title: "Funds Raised",
                value: `$${totalRaised.toLocaleString()}`,
                description: "Community contributions"
              },
              {
                icon: Users,
                title: "Volunteers Needed",
                value: totalVolunteersNeeded.toString(),
                description: "Across all programs"
              },
              {
                icon: Heart,
                title: "Active Causes",
                value: activeCauses.length.toString(),
                description: "Current initiatives"
              }
            ].map((stat, index) => (
              <ScrollAnimationWrapper key={stat.title} delay={index * 100}>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="primary-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</h3>
                    <p className="text-gray-600 text-sm">{stat.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>

          {/* Overall Progress */}
          <ScrollAnimationWrapper>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Overall Progress</h3>
                  <p className="text-gray-600">Combined progress across all initiatives</p>
                </div>
                <div className="space-y-4">
                  <Progress 
                    value={totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0} 
                    className="h-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${totalRaised.toLocaleString()} raised</span>
                    <span>{totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}% complete</span>
                    <span>${totalGoal.toLocaleString()} goal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Causes List */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Current <span className="primary-text">Initiatives</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join us in supporting these vital programs that are making a real difference in our community.
              </p>
            </div>
          </ScrollAnimationWrapper>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="w-full h-64 bg-gray-200" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-2 bg-gray-200 rounded mb-4" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-8 bg-gray-200 rounded w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : causes && causes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {causes.map((cause, index) => (
                <ScrollAnimationWrapper key={cause.id} delay={index * 200}>
                  <Card className="card-hover overflow-hidden h-full">
                    <OptimizedImage 
                      src={cause.imageUrl} 
                      alt={cause.title} 
                      className="w-full h-64 object-cover"
                    />
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{cause.title}</h3>
                          <p className="text-gray-600 mb-4">{cause.description}</p>
                        </div>
                        {cause.active && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        )}
                      </div>

                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-bold primary-text">
                            ${cause.raisedAmount.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">
                            {Math.round((cause.raisedAmount / cause.goalAmount) * 100)}% funded
                          </span>
                        </div>
                        <Progress 
                          value={(cause.raisedAmount / cause.goalAmount) * 100} 
                          className="h-3 mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Goal: ${cause.goalAmount.toLocaleString()}</span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {cause.volunteersNeeded} volunteers needed
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Link href={`/causes/${cause.slug}`}>
                          <Button variant="outline">
                            Learn More
                          </Button>
                        </Link>
                        <Link href="/get-involved">
                          <Button className="primary-bg text-white hover:opacity-90">
                            Get Involved
                          </Button>
                        </Link>
                      </div>
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Active Causes</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  We're currently developing new initiatives to support families in our community. Check back soon for upcoming causes you can support.
                </p>
                <Link href="/get-involved">
                  <Button className="primary-bg text-white">
                    Get Notified
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>
          )}
        </div>
      </section>

      {/* How to Help */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                How You Can <span className="primary-text">Help</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                There are many ways to support our causes and make a meaningful impact in the lives of families.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Volunteer Time",
                description: "Join our volunteer programs and directly support families in need",
                action: "Volunteer Now"
              },
              {
                title: "Make a Donation",
                description: "Financial contributions help us expand our reach and services",
                action: "Donate Today"
              },
              {
                title: "Spread the Word",
                description: "Share our mission with your network and on social media",
                action: "Share Mission"
              },
              {
                title: "Partner With Us",
                description: "Corporate partnerships amplify our impact in the community",
                action: "Learn More"
              }
            ].map((way, index) => (
              <ScrollAnimationWrapper key={way.title} delay={index * 100}>
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{way.title}</h3>
                    <p className="text-gray-600 text-sm mb-6">{way.description}</p>
                    <Link href="/get-involved">
                      <Button variant="outline" className="w-full">
                        {way.action}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Join Our Mission Today
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Every contribution, whether time or resources, helps us build stronger families and more peaceful communities. Start making a difference today.
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
