import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Shield, Eye, FileText, Scale, ArrowLeft, Mail, Phone } from "lucide-react";

export default function Legal() {
  return (
    <>
      <Helmet>
        <title>Legal Information - Family Peace Association</title>
        <meta name="description" content="Privacy policy, terms of service, and legal information for the Family Peace Association website and services." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Legal <span className="primary-text">Information</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Our commitment to transparency, privacy, and responsible service delivery for all families we serve.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</a>
              <span className="text-gray-400">•</span>
              <a href="#terms-of-service" className="text-primary hover:underline font-medium">Terms of Service</a>
              <span className="text-gray-400">•</span>
              <a href="#confidentiality" className="text-primary hover:underline font-medium">Confidentiality Policy</a>
              <span className="text-gray-400">•</span>
              <a href="#contact" className="text-primary hover:underline font-medium">Contact Us</a>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy-policy" className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <span>Privacy Policy</span>
                </CardTitle>
                <p className="text-gray-600">Last updated: December 2024</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h3>
                  <p className="text-gray-600 mb-4">
                    The Family Peace Association is committed to protecting your privacy. We collect information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Contact us for services or information</li>
                    <li>Apply to volunteer with our organization</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Participate in our programs or events</li>
                    <li>Visit our website (through cookies and analytics)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h3>
                  <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Provide family support services and counseling</li>
                    <li>Communicate with you about our programs and services</li>
                    <li>Process volunteer applications and coordinate activities</li>
                    <li>Send newsletters and updates (with your consent)</li>
                    <li>Improve our website and services</li>
                    <li>Comply with legal requirements and protect our rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Information Sharing</h3>
                  <p className="text-gray-600 mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>With your explicit consent</li>
                    <li>With trusted service providers who assist in our operations</li>
                    <li>When required by law or to protect safety</li>
                    <li>With partner organizations for coordinated care (with consent)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Security</h3>
                  <p className="text-gray-600">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Rights</h3>
                  <p className="text-gray-600 mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Access, update, or delete your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request a copy of your data</li>
                    <li>File a complaint about our data practices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Terms of Service */}
      <section id="terms-of-service" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-primary" />
                  <span>Terms of Service</span>
                </CardTitle>
                <p className="text-gray-600">Last updated: December 2024</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Acceptance of Terms</h3>
                  <p className="text-gray-600">
                    By accessing and using the Family Peace Association website and services, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Use of Services</h3>
                  <p className="text-gray-600 mb-4">Our services are provided for:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Families seeking support and counseling services</li>
                    <li>Individuals interested in volunteering</li>
                    <li>Community members seeking information about family wellness</li>
                    <li>Organizations interested in partnerships</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Uses</h3>
                  <p className="text-gray-600 mb-4">You may not use our services to:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Violate any laws or regulations</li>
                    <li>Transmit harmful, threatening, or offensive content</li>
                    <li>Interfere with the security of our systems</li>
                    <li>Impersonate another person or entity</li>
                    <li>Use our services for commercial purposes without permission</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
                  <p className="text-gray-600">
                    While we strive to provide quality services, the Family Peace Association cannot guarantee specific outcomes. Our services are not a substitute for professional medical or legal advice when such services are needed.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Modifications</h3>
                  <p className="text-gray-600">
                    We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our services constitutes acceptance of modified terms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Confidentiality Policy */}
      <section id="confidentiality" className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Eye className="w-6 h-6 text-primary" />
                  <span>Confidentiality Policy</span>
                </CardTitle>
                <p className="text-gray-600">Our commitment to client confidentiality</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Client Confidentiality</h3>
                  <p className="text-gray-600">
                    The Family Peace Association is committed to maintaining the highest standards of confidentiality in all client interactions. All information shared during counseling sessions, support groups, and other services is kept strictly confidential.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Limits to Confidentiality</h3>
                  <p className="text-gray-600 mb-4">
                    In accordance with professional ethics and legal requirements, confidentiality may be limited in the following situations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>When there is imminent danger to self or others</li>
                    <li>When child abuse or neglect is suspected</li>
                    <li>When elder abuse is suspected</li>
                    <li>When required by court order or subpoena</li>
                    <li>When client provides written consent to share information</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Record Keeping</h3>
                  <p className="text-gray-600">
                    We maintain secure records of all client interactions in accordance with professional standards and legal requirements. Records are stored securely and access is limited to authorized personnel only.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Staff Training</h3>
                  <p className="text-gray-600">
                    All staff members and volunteers receive comprehensive training on confidentiality policies and procedures. Regular updates ensure compliance with current best practices and legal requirements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Questions About Our <span className="primary-text">Policies?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                If you have questions about our privacy policy, terms of service, or confidentiality practices, please don't hesitate to contact us.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Email Us</h3>
                  <p className="text-gray-600 mb-4">
                    For questions about our policies or to exercise your privacy rights
                  </p>
                  <a 
                    href="mailto:legal@familypeace.org" 
                    className="text-primary hover:underline font-medium"
                  >
                    kenya@familypeaceassociation.org
                  </a>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <Card>
                <CardContent className="p-8 text-center">
                  <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Call Us</h3>
                  <p className="text-gray-600 mb-4">
                    Speak with our privacy officer during business hours
                  </p>
                  <a 
                    href="tel:+15551234567" 
                    className="text-primary hover:underline font-medium"
                  >
                    (555) 123-PEACE
                  </a>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>

          <ScrollAnimationWrapper>
            <div className="text-center mt-12">
              <Link href="/contact">
                <Button size="lg" className="primary-bg text-white hover:opacity-90">
                  Full Contact Information
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Back to Top */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
