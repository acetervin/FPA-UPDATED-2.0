import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Heart, 
  Palette, 
  Type, 
  Layout, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Star,
  Download,
  Copy,
  Settings
} from "lucide-react";

export default function StyleGuide() {
  const { theme, toggleTheme } = useTheme();
  const [copySuccess, setCopySuccess] = useState<string>("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const colorPalette = {
    golden: {
      primary: "hsl(45, 86%, 58%)",
      secondary: "hsl(45, 75%, 35%)",
      accent: "hsl(38, 77%, 45%)",
    },
    blue: {
      primary: "hsl(207, 90%, 54%)",
      secondary: "hsl(207, 70%, 40%)",
      accent: "hsl(174, 73%, 44%)",
    }
  };

  return (
    <>
      <Helmet>
        <title>Style Guide - Family Peace Association</title>
        <meta name="description" content="Brand guidelines, component showcase, and design system documentation for the Family Peace Association website." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Style <span className="primary-text">Guide</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Brand guidelines, component showcase, and design system documentation for consistent visual identity.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-600">Current Theme:</span>
                <Button 
                  variant="outline" 
                  onClick={toggleTheme}
                  className="capitalize"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  {theme} Theme
                </Button>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Brand Identity */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Brand <span className="primary-text">Identity</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid lg:grid-cols-2 gap-12">
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span>Logo & Mission</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 primary-bg rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Family Peace Association</h3>
                      <p className="text-sm text-gray-600">Building Stronger Families Together</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Brand Values</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Compassion and empathy in all interactions</li>
                      <li>• Evidence-based therapeutic approaches</li>
                      <li>• Community-centered healing and support</li>
                      <li>• Inclusive and culturally sensitive services</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <span>Color Palette</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(colorPalette).map(([themeName, colors]) => (
                      <div key={themeName}>
                        <h4 className="font-semibold text-gray-800 mb-3 capitalize">{themeName} Theme</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.entries(colors).map(([colorName, colorValue]) => (
                            <div key={colorName} className="text-center">
                              <div 
                                className="w-full h-16 rounded-lg mb-2 cursor-pointer border border-gray-200"
                                style={{ backgroundColor: colorValue }}
                                onClick={() => copyToClipboard(colorValue, `${themeName}-${colorName}`)}
                                title="Click to copy"
                              />
                              <p className="text-xs font-medium text-gray-800 capitalize">{colorName}</p>
                              <p className="text-xs text-gray-500">{colorValue}</p>
                              {copySuccess === `${themeName}-${colorName}` && (
                                <p className="text-xs text-green-600">Copied!</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                <Type className="w-8 h-8 inline mr-3" />
                Typography
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto">
            <ScrollAnimationWrapper>
              <Card>
                <CardContent className="p-8 space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Headings</h3>
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl font-bold text-gray-800">Heading 1 - Hero Title</h1>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Heading 2 - Section Title</h2>
                      <h3 className="text-2xl font-bold text-gray-800">Heading 3 - Subsection</h3>
                      <h4 className="text-xl font-semibold text-gray-800">Heading 4 - Card Title</h4>
                      <h5 className="text-lg font-medium text-gray-800">Heading 5 - Small Title</h5>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Body Text</h3>
                    <div className="space-y-4">
                      <p className="text-xl text-gray-600">Large body text for introductory paragraphs and important content that needs to stand out from regular body text.</p>
                      <p className="text-base text-gray-600">Regular body text used for most content throughout the website. This is the standard paragraph text with optimal readability.</p>
                      <p className="text-sm text-gray-500">Small text used for captions, metadata, and secondary information that supports the main content.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Special Text</h3>
                    <div className="space-y-2">
                      <p className="text-base text-gray-600">Text with <span className="primary-text font-semibold">primary color highlighting</span> for emphasis</p>
                      <p className="text-base text-gray-600">Text with <strong className="font-bold">bold formatting</strong> for strong emphasis</p>
                      <p className="text-base text-gray-600">Text with <em className="italic">italic formatting</em> for subtle emphasis</p>
                      <p className="text-base text-gray-600">Text with <a href="#" className="text-primary hover:underline">link styling</a> for navigation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                <Layout className="w-8 h-8 inline mr-3" />
                Components
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="space-y-12">
            {/* Buttons */}
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Primary Buttons</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button className="primary-bg text-white hover:opacity-90">Primary Button</Button>
                      <Button size="lg" className="primary-bg text-white hover:opacity-90">Large Primary</Button>
                      <Button size="sm" className="primary-bg text-white hover:opacity-90">Small Primary</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Secondary Buttons</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Icon Buttons</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button className="primary-bg text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* Form Elements */}
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Form Elements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="example-input">Text Input</Label>
                        <Input id="example-input" placeholder="Enter text here..." />
                      </div>
                      <div>
                        <Label htmlFor="example-textarea">Textarea</Label>
                        <Textarea id="example-textarea" placeholder="Enter longer text here..." />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="example-checkbox" />
                        <Label htmlFor="example-checkbox">Checkbox option</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="example-switch" />
                        <Label htmlFor="example-switch">Switch option</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* Badges and Alerts */}
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Badges</h4>
                    <div className="flex flex-wrap gap-4">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Alerts</h4>
                    <div className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                          This is an informational alert with helpful content.
                        </AlertDescription>
                      </Alert>
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          This is an error alert indicating something went wrong.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            {/* Progress and Interactive */}
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Progress & Interactive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Progress Bars</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Fundraising Progress</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Volunteer Goal</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Rating Display</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">5.0 out of 5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Usage <span className="primary-text">Guidelines</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Do's</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Use consistent spacing and alignment</li>
                    <li>• Maintain proper color contrast for accessibility</li>
                    <li>• Follow the established typography hierarchy</li>
                    <li>• Use primary colors for call-to-action elements</li>
                    <li>• Implement hover states for interactive elements</li>
                    <li>• Ensure responsive design across all devices</li>
                    <li>• Use animations to enhance user experience</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span>Don'ts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Don't use colors outside the defined palette</li>
                    <li>• Don't mix different button styles inconsistently</li>
                    <li>• Don't use more than 3 font weights on a page</li>
                    <li>• Don't ignore mobile-first design principles</li>
                    <li>• Don't overuse animations or make them too fast</li>
                    <li>• Don't compromise accessibility for visual appeal</li>
                    <li>• Don't use low contrast color combinations</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Download Resources */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Brand Resources
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Download brand assets, logos, and style guidelines for consistent implementation across all materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                  <Download className="w-4 h-4 mr-2" />
                  Download Logo Pack
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Style Guide PDF
                </Button>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </>
  );
}
