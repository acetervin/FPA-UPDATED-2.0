import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { Lock, Eye, EyeOff, ArrowLeft, Shield, Key } from "lucide-react";

const passwordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function PasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  // In a real implementation, this would be more secure
  const correctPassword = "FamilyPeace2024!";
  const maxAttempts = 3;

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: PasswordForm) => {
    if (data.password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        setError(`Access denied. Too many failed attempts. Please contact support.`);
      } else {
        setError(`Incorrect password. ${maxAttempts - newAttempts} attempt(s) remaining.`);
      }
      
      form.reset();
    }
  };

  const protectedContent = (
    <div className="space-y-8">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You have successfully accessed the protected content area.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Training materials and guidelines</li>
              <li>• Internal documentation</li>
              <li>• Staff contact directory</li>
              <li>• Emergency procedures</li>
              <li>• Policy updates and announcements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Board Member Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Board meeting minutes</li>
              <li>• Financial reports and budgets</li>
              <li>• Strategic planning documents</li>
              <li>• Governance policies</li>
              <li>• Annual reports and assessments</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volunteer Coordinators</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Volunteer management tools</li>
              <li>• Training schedules and materials</li>
              <li>• Program coordination resources</li>
              <li>• Event planning documents</li>
              <li>• Communication templates</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administrative Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Database management system</li>
              <li>• Reporting and analytics</li>
              <li>• Communication platforms</li>
              <li>• File sharing and storage</li>
              <li>• Calendar and scheduling tools</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setIsAuthenticated(false)} 
          variant="outline"
        >
          <Lock className="w-4 h-4 mr-2" />
          Lock Content
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Protected Content - Family Peace Association</title>
        <meta name="description" content="Access protected content and resources for Family Peace Association staff, volunteers, and board members." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                <Lock className="w-12 h-12 inline mr-4" />
                Protected Content
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {isAuthenticated 
                  ? "Welcome to the secure area. Access your resources below."
                  : "This area contains sensitive information. Please enter the password to continue."
                }
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {!isAuthenticated ? (
              <ScrollAnimationWrapper>
                <Card className="max-w-md mx-auto">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Enter Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {attempts < maxAttempts && (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter password"
                                      className="pr-10"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-1 top-1 h-8 w-8 p-0"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full primary-bg text-white">
                            <Lock className="w-4 h-4 mr-2" />
                            Access Content
                          </Button>
                        </form>
                      </Form>
                    )}

                    <div className="mt-6 text-center">
                      <Link href="/">
                        <Button variant="outline">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ) : (
              <ScrollAnimationWrapper>
                <div>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                      Protected <span className="primary-text">Resources</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Access internal resources, documentation, and tools for staff, volunteers, and board members.
                    </p>
                  </div>
                  {protectedContent}
                </div>
              </ScrollAnimationWrapper>
            )}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Security Notice</h3>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        This protected area contains confidential information intended only for authorized personnel 
                        of the Family Peace Association. Access is logged and monitored for security purposes.
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Do not share passwords or access credentials</li>
                        <li>Always log out when finished accessing content</li>
                        <li>Report any suspicious activity immediately</li>
                        <li>Contact IT support if you experience access issues</li>
                      </ul>
                      <p className="text-sm text-gray-500 mt-4">
                        For technical support or password reset requests, please contact our IT department at 
                        <a href="mailto:it@familypeace.org" className="text-primary hover:underline ml-1">
                          it@familypeace.org
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Help Section */}
      {!isAuthenticated && (
        <section className="py-20 primary-bg">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Need Help Accessing Content?
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  If you're having trouble accessing protected content or need assistance with passwords, our support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}
    </>
  );
}
