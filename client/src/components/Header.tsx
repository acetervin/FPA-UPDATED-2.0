import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";
import { Palette, Menu, X, Heart, Users, FileText, Phone, Scale, Lightbulb, Package, Calendar, Lock } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href}>
      <a className={`font-medium transition-colors hover:text-primary ${isActive(href) ? 'text-primary font-semibold' : 'text-foreground/80'} ${className}`}>
        {children}
      </a>
    </Link>
  );

  const Logo = () => (
    <Link href="/">
      <a className="flex items-center space-x-3">
        <div className="w-10 h-10 primary-bg rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Family Peace Association</h1>
          <p className="text-xs text-muted-foreground">Building Stronger Families Together</p>
        </div>
      </a>
    </Link>
  );

  const aboutMenuItems = [
    { href: "/about", label: "Our Story", icon: Heart },
    { href: "/team", label: "Our Team", icon: Users },
  ];

  const cmsMenuItems = [
    { href: "/blog", label: "Blog Posts", icon: FileText },
    { href: "/causes", label: "Our Causes", icon: Heart },
    { href: "/team", label: "Team Members", icon: Users },
  ];

  const essentialMenuItems = [
    { href: "/style-guide", label: "Style Guide", icon: Palette },
    { href: "/licenses", label: "Licenses", icon: Scale },
    { href: "/changelog", label: "Changelog", icon: Calendar },
    { href: "/password", label: "Password Page", icon: Lock },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavLink href="/">Home</NavLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>About</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-4">
                      <div className="space-y-2">
                        {aboutMenuItems.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link href={item.href}>
                              <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavLink href="/features">Features</NavLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavLink href="/blog">Blog</NavLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>CMS</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-4">
                      <div className="space-y-2">
                        {cmsMenuItems.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link href={item.href}>
                              <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Essential</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-4">
                      <div className="space-y-2">
                        {essentialMenuItems.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link href={item.href}>
                              <a className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </a>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavLink href="/contact">Contact</NavLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Theme Switcher */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'golden' ? 'blue' : 'golden'} theme`}
            >
              <Palette className="w-4 h-4" />
            </Button>
            
            <Link href="/get-involved">
              <Button className="primary-bg hover:opacity-90">
                Get Involved
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Home</a>
                </Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">About</a>
                </Link>
                <Link href="/features" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Features</a>
                </Link>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Blog</a>
                </Link>
                <Link href="/team" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Team</a>
                </Link>
                <Link href="/causes" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Causes</a>
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Contact</a>
                </Link>
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={toggleTheme}
                    className="w-full justify-start"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Switch to {theme === 'golden' ? 'Blue' : 'Golden'} Theme
                  </Button>
                </div>
                <Link href="/get-involved" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full primary-bg">
                    Get Involved
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
