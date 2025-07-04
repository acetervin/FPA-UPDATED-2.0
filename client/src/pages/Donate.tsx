import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  CheckCircle,
  Star,
  CreditCard,
  Building,
  Smartphone
} from "lucide-react";

export default function Donate() {
  return (
    <>
      <Helmet>
        <title>Donate - Family Peace Association</title>
        <meta name="description" content="Support the Family Peace Association's mission to build stronger families through your generous donation. Every contribution makes a difference." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-orange-50 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Make a <span className="text-yellow-600">Difference</span> Today
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Your generous support helps us provide essential family counseling services, 
                conflict resolution programs, and community outreach to those who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3">
                  Donate Now
                </Button>
                <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                  Learn About Our Impact
                </Button>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Donation Impact */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Your Impact
              </h2>
              <p className="text-xl text-gray-600">
                See how your donation directly helps families in our community
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <ScrollAnimationWrapper delay={100}>
              <Card className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="space-y-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">$50</h3>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Family Counseling Session</h4>
                    <p className="text-gray-600">
                      Provides one hour of professional family counseling to help resolve conflicts and strengthen relationships.
                    </p>
                  </div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Donate $50
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={200}>
              <Card className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow border-2 border-yellow-200">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-2">
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">$150</h3>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Family Support Package</h4>
                    <p className="text-gray-600">
                      Covers three counseling sessions plus access to our family resource library and workshops.
                    </p>
                  </div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Donate $150
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={300}>
              <Card className="text-center p-8 border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">$300</h3>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Complete Program Access</h4>
                    <p className="text-gray-600">
                      Full access to all our programs including counseling, workshops, and ongoing family support services.
                    </p>
                  </div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Donate $300
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>

          {/* Custom Amount */}
          <ScrollAnimationWrapper>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Custom Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                    $
                  </span>
                  <input
                    type="number"
                    className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-yellow-500 focus:border-yellow-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  Donate Custom Amount
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimationWrapper>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Why Your Support Matters
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Every family deserves access to professional support during challenging times. 
                  Your donation directly funds our mission to strengthen family bonds and create healthier communities.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Professional Counseling</h4>
                      <p className="text-gray-600">Licensed therapists providing expert family guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Crisis Intervention</h4>
                      <p className="text-gray-600">24/7 support for families in immediate need</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Community Programs</h4>
                      <p className="text-gray-600">Educational workshops and family strengthening activities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Resource Library</h4>
                      <p className="text-gray-600">Access to books, materials, and online resources</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper animation="slide-in-right">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=700" 
                  alt="Happy family after counseling session"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">98% Success Rate</p>
                      <p className="text-sm text-gray-600">Family satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Safe & Secure Donations
              </h2>
              <p className="text-xl text-gray-600">
                Multiple convenient ways to support our mission
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ScrollAnimationWrapper delay={100}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Credit & Debit Cards</h3>
                  <p className="text-gray-600">Secure online payments with all major cards</p>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={200}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Building className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Bank Transfer</h3>
                  <p className="text-gray-600">Direct bank transfers for larger donations</p>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper delay={300}>
              <Card className="text-center p-8 border-none shadow-lg">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Mobile Payments</h3>
                  <p className="text-gray-600">PayPal, Apple Pay, and Google Pay accepted</p>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>

          <ScrollAnimationWrapper delay={400}>
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                All donations are processed securely and you'll receive a receipt for tax purposes.
              </p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                <span>🔒 SSL Encrypted</span>
                <span>•</span>
                <span>🛡️ Privacy Protected</span>
                <span>•</span>
                <span>📧 Instant Receipt</span>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Make an Impact?
              </h2>
              <p className="text-xl leading-relaxed mb-8 text-yellow-100">
                Join hundreds of supporters who are already making a difference in families' lives. 
                Your donation today helps build stronger, more resilient families in our community.
              </p>
              <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Start Your Donation
              </Button>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}