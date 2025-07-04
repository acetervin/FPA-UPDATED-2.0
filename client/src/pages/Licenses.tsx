import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { ExternalLink, FileText, Code, Heart, ArrowLeft } from "lucide-react";

export default function Licenses() {
  const licenses = [
    {
      name: "React",
      version: "18.3.1",
      license: "MIT",
      description: "A JavaScript library for building user interfaces",
      url: "https://github.com/facebook/react",
      licenseUrl: "https://github.com/facebook/react/blob/main/LICENSE"
    },
    {
      name: "TypeScript",
      version: "5.6.3",
      license: "Apache-2.0",
      description: "TypeScript is a superset of JavaScript that compiles to plain JavaScript",
      url: "https://github.com/microsoft/TypeScript",
      licenseUrl: "https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt"
    },
    {
      name: "Tailwind CSS",
      version: "3.4.17",
      license: "MIT",
      description: "A utility-first CSS framework for rapidly building custom designs",
      url: "https://github.com/tailwindlabs/tailwindcss",
      licenseUrl: "https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE"
    },
    {
      name: "Vite",
      version: "5.4.19",
      license: "MIT",
      description: "Next generation frontend tooling. It's fast!",
      url: "https://github.com/vitejs/vite",
      licenseUrl: "https://github.com/vitejs/vite/blob/main/LICENSE"
    },
    {
      name: "React Hook Form",
      version: "7.55.0",
      license: "MIT",
      description: "Performant, flexible and extensible forms with easy validation",
      url: "https://github.com/react-hook-form/react-hook-form",
      licenseUrl: "https://github.com/react-hook-form/react-hook-form/blob/master/LICENSE"
    },
    {
      name: "TanStack Query",
      version: "5.60.5",
      license: "MIT",
      description: "Powerful data synchronization for React",
      url: "https://github.com/TanStack/query",
      licenseUrl: "https://github.com/TanStack/query/blob/main/LICENSE"
    },
    {
      name: "Lucide React",
      version: "0.453.0",
      license: "ISC",
      description: "Beautiful & consistent icon toolkit made by the community",
      url: "https://github.com/lucide-icons/lucide",
      licenseUrl: "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
    },
    {
      name: "Radix UI",
      version: "Various",
      license: "MIT",
      description: "Low-level UI primitives for React",
      url: "https://github.com/radix-ui/primitives",
      licenseUrl: "https://github.com/radix-ui/primitives/blob/main/LICENSE"
    },
    {
      name: "Zod",
      version: "3.24.2",
      license: "MIT",
      description: "TypeScript-first schema validation with static type inference",
      url: "https://github.com/colinhacks/zod",
      licenseUrl: "https://github.com/colinhacks/zod/blob/master/LICENSE"
    },
    {
      name: "Framer Motion",
      version: "11.13.1",
      license: "MIT",
      description: "A production-ready motion library for React",
      url: "https://github.com/framer/motion",
      licenseUrl: "https://github.com/framer/motion/blob/main/LICENSE"
    },
    {
      name: "Wouter",
      version: "3.3.5",
      license: "MIT",
      description: "A minimalist-friendly ~1.3KB routing for React and Preact",
      url: "https://github.com/molefrog/wouter",
      licenseUrl: "https://github.com/molefrog/wouter/blob/master/LICENSE"
    },
    {
      name: "Express.js",
      version: "4.21.2",
      license: "MIT",
      description: "Fast, unopinionated, minimalist web framework for Node.js",
      url: "https://github.com/expressjs/express",
      licenseUrl: "https://github.com/expressjs/express/blob/master/LICENSE"
    },
    {
      name: "Drizzle ORM",
      version: "0.39.1",
      license: "Apache-2.0",
      description: "TypeScript ORM for SQL databases",
      url: "https://github.com/drizzle-team/drizzle-orm",
      licenseUrl: "https://github.com/drizzle-team/drizzle-orm/blob/main/LICENSE"
    },
    {
      name: "class-variance-authority",
      version: "0.7.1",
      license: "Apache-2.0",
      description: "CVA - Class Variance Authority",
      url: "https://github.com/joe-bell/cva",
      licenseUrl: "https://github.com/joe-bell/cva/blob/main/LICENSE"
    },
    {
      name: "clsx",
      version: "2.1.1",
      license: "MIT",
      description: "A tiny utility for constructing className strings conditionally",
      url: "https://github.com/lukeed/clsx",
      licenseUrl: "https://github.com/lukeed/clsx/blob/master/license"
    }
  ];

  const assets = [
    {
      name: "Unsplash Photos",
      description: "High-quality stock photography used throughout the website",
      license: "Unsplash License",
      url: "https://unsplash.com",
      licenseUrl: "https://unsplash.com/license"
    },
    {
      name: "Google Fonts - Inter",
      description: "Primary typography font family",
      license: "Open Font License",
      url: "https://fonts.google.com/specimen/Inter",
      licenseUrl: "https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Licenses - Family Peace Association</title>
        <meta name="description" content="Open source licenses and attributions for third-party libraries, assets, and resources used in the Family Peace Association website." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Open Source <span className="primary-text">Licenses</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Acknowledgments and licenses for the open source libraries, assets, and resources that power our website.
              </p>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span>Our Commitment to Open Source</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    The Family Peace Association website is built with gratitude for the open source community. 
                    We believe in transparency and giving credit where it's due. This page lists all the 
                    third-party libraries, frameworks, and assets that make our digital presence possible.
                  </p>
                  <p className="text-gray-600">
                    Each library and resource listed below is used in accordance with its respective license. 
                    We encourage you to explore these amazing projects and consider contributing to the 
                    open source ecosystem.
                  </p>
                  <div className="flex items-center space-x-4 pt-4">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Code className="w-3 h-3" />
                      <span>MIT Licensed</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Apache-2.0</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>ISC Licensed</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Software Libraries */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Software <span className="primary-text">Libraries</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                JavaScript libraries, frameworks, and tools that power our application.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 gap-6">
            {licenses.map((library, index) => (
              <ScrollAnimationWrapper key={library.name} delay={index * 50}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{library.name}</h3>
                        <p className="text-sm text-gray-500">Version {library.version}</p>
                      </div>
                      <Badge variant={library.license === 'MIT' ? 'default' : 'secondary'}>
                        {library.license}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">{library.description}</p>
                    
                    <div className="flex space-x-3">
                      <a
                        href={library.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Project
                      </a>
                      <a
                        href={library.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        License
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Assets and Resources */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Assets & <span className="primary-text">Resources</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Images, fonts, and other creative resources used throughout our website.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {assets.map((asset, index) => (
              <ScrollAnimationWrapper key={asset.name} delay={index * 100}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{asset.name}</h3>
                      <Badge variant="outline">{asset.license}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm">{asset.description}</p>
                    
                    <div className="flex space-x-3">
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Source
                      </a>
                      <a
                        href={asset.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        License
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* License Texts */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Common <span className="primary-text">License Texts</span>
              </h2>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-4xl mx-auto space-y-8">
            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>MIT License</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 font-mono">
                    <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                    <br />
                    <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                    <br />
                    <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Apache License 2.0</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 font-mono">
                    <p>Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at</p>
                    <br />
                    <p>http://www.apache.org/licenses/LICENSE-2.0</p>
                    <br />
                    <p>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-20 primary-bg">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Thank You, Open Source Community
              </h2>
              <p className="text-xl text-white/90 mb-8">
                We're grateful for the incredible work of developers and creators who make their projects freely available. Your contributions make the web a better place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="bg-white text-gray-800 hover:bg-gray-100">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
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
