import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { ArrowLeft, Users, Target, Calendar, CheckCircle, Heart } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { Cause } from "@shared/schema";
import SEO from "@/components/SEO";
import { getActiveCauses } from "@/lib/staticData";

export default function CausePage() {
  const { slug } = useParams();
  
  const { data: cause, isLoading } = useQuery<Cause>({
    queryKey: [`/api/causes/${slug}`],
    enabled: !!slug,
  });

  const { data: allCauses } = useQuery<Cause[]>({
    queryKey: ["active-causes"],
    queryFn: () => getActiveCauses(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Cause Not Found</h1>
          <p className="text-gray-600 mb-8">The cause you're looking for doesn't exist.</p>
          <Link href="/causes">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Causes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const otherCauses = allCauses?.filter(c => c.id !== cause.id).slice(0, 3) || [];
  const progressPercentage = Math.round((cause.raisedAmount / cause.goalAmount) * 100);

  return (
    <>
      <SEO />
      <Helmet>
        <title>{cause.title} - Family Peace Association</title>
        <meta name="description" content={cause.description} />
        <meta property="og:title" content={cause.title} />
        <meta property="og:description" content={cause.description} />
        <meta property="og:image" content={cause.imageUrl} />
      </Helmet>

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <ScrollAnimationWrapper>
            <Link href="/causes">
              <Button variant="outline" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Causes
              </Button>
            </Link>
          </ScrollAnimationWrapper>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <ScrollAnimationWrapper animation="slide-in-left">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  {cause.active && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Active Campaign
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  {cause.title}
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {cause.description}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold primary-text mb-1">
                      ${cause.raisedAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Raised</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold primary-text mb-1">
                      {cause.volunteersNeeded}
                    </div>
                    <div className="text-sm text-gray-600">Volunteers Needed</div>
                  </div>
                </div>

                <Link href="/get-involved">
                  <Button size="lg" className="primary-bg text-white hover:opacity-90">
                    Get Involved
                  </Button>
                </Link>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="slide-in-right">
              <OptimizedImage 
                src={cause.imageUrl} 
                alt={cause.title} 
                className="rounded-xl shadow-lg w-full"
              />
            </ScrollAnimationWrapper>
          </div>

          {/* Progress Section */}
          <ScrollAnimationWrapper>
            <Card className="mb-20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Campaign Progress</h2>
                  <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl font-bold primary-text">
                        ${cause.raisedAmount.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-600">
                        {progressPercentage}% of goal
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-4 mb-4" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Goal: ${cause.goalAmount.toLocaleString()}</span>
                      <span>
                        ${(cause.goalAmount - cause.raisedAmount).toLocaleString()} remaining
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>

          {/* Detailed Description */}
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            <ScrollAnimationWrapper className="lg:col-span-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Initiative</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {cause.fullDescription}
                  </p>
                </div>

                {/* Impact Goals */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Goals</h3>
                  <div className="space-y-4">
                    {[
                      "Provide comprehensive support to families in crisis",
                      "Train community volunteers in family support techniques",
                      "Establish sustainable programs for long-term impact",
                      "Build partnerships with local organizations",
                      "Create resources for ongoing family wellness"
                    ].map((goal, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="space-y-6">
                {/* Key Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-gray-800">Funding Goal</div>
                          <div className="text-sm text-gray-600">${cause.goalAmount.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-gray-800">Volunteers Needed</div>
                          <div className="text-sm text-gray-600">{cause.volunteersNeeded} people</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium text-gray-800">Status</div>
                          <div className="text-sm text-gray-600">
                            {cause.active ? "Active Campaign" : "Completed"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* How to Help */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">How You Can Help</h3>
                    <div className="space-y-3">
                      <Link href="/get-involved">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="w-4 h-4 mr-2" />
                          Volunteer Your Time
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" className="w-full justify-start">
                          <Heart className="w-4 h-4 mr-2" />
                          Make a Donation
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Attend Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>

      {/* Related Causes */}
      {otherCauses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Other <span className="primary-text">Causes</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Discover more ways to support families in our community
                </p>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid md:grid-cols-3 gap-8">
              {otherCauses.map((otherCause, index) => (
                <ScrollAnimationWrapper key={otherCause.id} delay={index * 100}>
                  <Card className="card-hover overflow-hidden h-full">
                    <img 
                      src={otherCause.imageUrl} 
                      alt={otherCause.title} 
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">{otherCause.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{otherCause.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>${otherCause.raisedAmount.toLocaleString()}</span>
                          <span>{Math.round((otherCause.raisedAmount / otherCause.goalAmount) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(otherCause.raisedAmount / otherCause.goalAmount) * 100} 
                          className="h-2"
                        />
                      </div>

                      <Link href={`/causes/${otherCause.slug}`}>
                        <Button variant="outline" className="w-full">
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
                Join us in supporting {cause.title.toLowerCase()} and help us create lasting positive change in our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-involved">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    Get Involved Today
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
