import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Heart, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Handshake,
  GraduationCap,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import type { Cause } from "@shared/schema";

const volunteerApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  program: z.string().min(1, "Please select a program"),
  experience: z.string().optional(),
  availability: z.string().min(1, "Please describe your availability"),
  message: z.string().optional(),
});

type VolunteerApplicationForm = z.infer<typeof volunteerApplicationSchema>;

export default function GetInvolved() {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const { toast } = useToast();

  const { data: causes } = useQuery<Cause[]>({
    queryKey: ["/api/causes/active"],
  });

  const form = useForm<VolunteerApplicationForm>({
    resolver: zodResolver(volunteerApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: "",
      experience: "",
      availability: "",
      message: "",
    },
  });

  const volunteerMutation = useMutation({
    mutationFn: (data: VolunteerApplicationForm) => 
      apiRequest("POST", "/api/volunteer-applications", data),
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in volunteering. We'll be in touch soon.",
      });
      form.reset();
      setSelectedProgram("");
      queryClient.invalidateQueries({ queryKey: ["/api/volunteer-applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VolunteerApplicationForm) => {
    volunteerMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Get Involved - Family Peace Association</title>
        <meta name="description" content="Join our mission to strengthen families and build peaceful communities. Discover volunteer opportunities, ways to support, and community partnerships." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Get <span className="primary-text">Involved</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join our community of dedicated volunteers and supporters working to strengthen families and create lasting peace in our communities.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Volunteer <span className="primary-text">Opportunities</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from various ways to contribute your time and skills to support families in our community.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Family Advocate",
                commitment: "4 hours/week",
                schedule: "Flexible",
                description: "Provide direct support to families through advocacy and guidance.",
                benefits: [
                  "Monthly Impact Report",
                  "Training Provided", 
                  "Recognition Certificate",
                  "Volunteer Appreciation Events"
                ],
                color: "bg-blue-50 border-blue-200"
              },
              {
                title: "Support Specialist",
                commitment: "8 hours/week", 
                schedule: "Regular",
                description: "Lead support groups and facilitate healing workshops for families.",
                benefits: [
                  "Specialized Training",
                  "Mentorship Program",
                  "Volunteer Coordinator Access",
                  "Leadership Opportunities"
                ],
                color: "bg-yellow-50 border-yellow-200 ring-2 ring-yellow-300"
              },
              {
                title: "Program Leader",
                commitment: "12 hours/week",
                schedule: "Dedicated", 
                description: "Lead comprehensive family programs and mentor other volunteers.",
                benefits: [
                  "Advanced Certification",
                  "Program Development Input",
                  "Board Meeting Invitations",
                  "Annual Leadership Retreat"
                ],
                color: "bg-green-50 border-green-200"
              }
            ].map((opportunity, index) => (
              <ScrollAnimationWrapper key={opportunity.title} delay={index * 100}>
                <Card className={`card-hover h-full ${opportunity.color}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                      {opportunity.title}
                    </CardTitle>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="primary-bg text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {opportunity.commitment}
                      </Badge>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {opportunity.schedule} schedule
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">{opportunity.description}</p>
                    <div className="space-y-3 text-left mb-6">
                      {opportunity.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full primary-bg text-white hover:opacity-90"
                      onClick={() => setSelectedProgram(opportunity.title)}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Current Causes */}
      {causes && causes.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Active <span className="primary-text">Initiatives</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Join one of our current programs and make an immediate impact in the lives of families.
                </p>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid md:grid-cols-2 gap-8">
              {causes.map((cause, index) => (
                <ScrollAnimationWrapper key={cause.id} delay={index * 200}>
                  <Card className="card-hover overflow-hidden h-full">
                    <img 
                      src={cause.imageUrl} 
                      alt={cause.title} 
                      className="w-full h-48 object-cover"
                    />
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
                        <span className="text-sm text-gray-500 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {cause.volunteersNeeded} volunteers needed
                        </span>
                        <Link href={`/causes/${cause.slug}`}>
                          <Button className="primary-bg text-white hover:opacity-90">
                            Learn More
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

      {/* Volunteer Application Form */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Volunteer <span className="primary-text">Application</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Ready to make a difference? Fill out our volunteer application to get started.
                </p>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <Card>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="program"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Program Interest *</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={selectedProgram || field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a program" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Family Advocate">Family Advocate</SelectItem>
                                  <SelectItem value="Support Specialist">Support Specialist</SelectItem>
                                  <SelectItem value="Program Leader">Program Leader</SelectItem>
                                  <SelectItem value="Event Support">Event Support</SelectItem>
                                  <SelectItem value="Administrative Support">Administrative Support</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Availability *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your availability (days, times, hours per week)"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relevant Experience</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about any relevant experience you have (volunteer work, education, professional background)"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Is there anything else you'd like us to know about your interest in volunteering?"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full primary-bg text-white hover:opacity-90"
                        disabled={volunteerMutation.isPending}
                      >
                        {volunteerMutation.isPending ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Other Ways to <span className="primary-text">Support Us</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Can't volunteer regularly? There are many other ways to support our mission.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Donate",
                description: "Financial contributions help us expand our services and reach more families."
              },
              {
                icon: Users,
                title: "Spread Awareness",
                description: "Share our mission with friends, family, and on social media."
              },
              {
                icon: Handshake,
                title: "Corporate Partnership",
                description: "Partner with us through your business for community impact initiatives."
              },
              {
                icon: GraduationCap,
                title: "Professional Services",
                description: "Offer your professional skills on a pro-bono or reduced-rate basis."
              }
            ].map((way, index) => (
              <ScrollAnimationWrapper key={way.title} delay={index * 100}>
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="accent-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <way.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{way.title}</h3>
                    <p className="text-gray-600 text-sm">{way.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Have Questions?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                We're here to help you find the perfect way to get involved. Reach out to learn more about our volunteer opportunities.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                  <p className="text-white/90">(555) 123-PEACE</p>
                </div>
                <div className="text-center">
                  <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-white/90">volunteer@familypeace.org</p>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-white mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Visit Us</h3>
                  <p className="text-white/90">123 Peace Ave<br />Community City, PC 12345</p>
                </div>
              </div>

              <Link href="/contact">
                <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                  Contact Us
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
