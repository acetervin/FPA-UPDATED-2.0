import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import SEO from "@/components/SEO";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) => 
      apiRequest("POST", "/api/contact-submissions", data),
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      <SEO />
      <Helmet>
        <title>Contact Us - Family Peace Association</title>
        <meta name="description" content="Get in touch with the Family Peace Association. Contact us for support, questions about our services, or to learn more about volunteer opportunities." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Contact <span className="primary-text">Us</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're here to help. Reach out to us for support, questions about our services, or to learn more about how you can get involved.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollAnimationWrapper>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <MessageCircle className="w-6 h-6 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
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

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <FormControl>
                              <Input placeholder="What is this regarding?" {...field} />
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
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your inquiry or how we can help you..."
                                rows={6}
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
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* Contact Details */}
            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                  <p className="text-gray-600 mb-8">
                    We're committed to providing support when you need it most. Whether you're seeking services, want to volunteer, or have questions about our programs, we're here to help.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="primary-bg w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Visit Our Office</h3>
                          <p className="text-gray-600">
                            Wu Yi Plaza, 3rd Floor, Block E8<br />
                            Galana Road, Kilimani, Nairobi.<br />
                            P.O. Box 36337-00200 Nairobi, Kenya
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="primary-bg w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
                          <p className="text-gray-600 mb-2">
                            Telephone: <a href="tel:0208020770" className="text-primary hover:underline">0208020770</a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="primary-bg w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
                          <p className="text-gray-600 mb-1">
                            General Inquiries: <a href="mailto:kenya@familypeaceassociation.org" className="text-primary hover:underline">kenya@familypeaceassociation.org</a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hours */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="primary-bg w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">Office Hours</h3>
                          <div className="space-y-1 text-gray-600">
                            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                            <p>Saturday: 9:00 AM - 4:00 PM</p>
                            <p>Sunday: Closed</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Emergency support available 24/7
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Find <span className="primary-text">Us</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Located in the heart of the community, our office is easily accessible and designed to provide a welcoming, safe environment for all families.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Placeholder for map - in real implementation, you'd integrate with Google Maps or similar */}
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h3>
                    <p className="text-gray-500">Wu Yi Plaza, 3rd Floor, Room E8, Galana Road, Kilimani, Nairobi</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.open('https://maps.google.com/?q=Wu+Yi+Plaza,+Galana+Road,+Kilimani,+Nairobi', '_blank')}
                    >
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>

          {/* Directions */}
          <ScrollAnimationWrapper>
            <div className="mt-12 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Getting Here</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">By Car</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Free parking is available in our on-site lot. The building is wheelchair accessible with designated accessible parking spaces near the main entrance.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">By Public Transit</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Bus routes 12, 15, and 23 stop within two blocks of our office. The Metro Green Line Community Station is a 10-minute walk from our building.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-red-50 border-t border-red-100">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Need <span className="text-red-600">Immediate Support?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                If you or someone you know is in immediate danger or experiencing a family crisis, please reach out for help right away.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Crisis Hotlines</h3>
                    <div className="mb-2">
                      <div className="text-gray-800 text-base mt-2">
                        <div className="mb-1">
                          <span className="font-semibold">Red Cross:</span> <span className="text-red-600">1199</span>
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">EMKF:</span> <span className="text-red-600">0800 723 253</span>
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Niskize:</span> <span className="text-red-600">0900 620 800</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-2">Emergency Services</h3>
                    <p className="text-2xl font-bold text-red-600 mb-2">911</p>
                    <p className="text-sm text-gray-600">For immediate emergencies</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
