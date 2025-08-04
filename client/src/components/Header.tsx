import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import FpaLogo from "@/assets/Fpa-logo.jpg";
import { OptimizedImage } from "./ui/optimized-image";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href} className={`font-medium transition-colors hover:text-yellow-600 ${isActive(href) ? 'text-yellow-600 font-semibold' : 'text-gray-700'} ${className}`}>
      {children}
    </Link>
  );

  const Logo = () => (
    <Link href="/">
      <div className="flex items-center">
        <OptimizedImage 
          src={FpaLogo} 
          alt="Family Peace Association Kenya Logo"
          className="h-14 w-auto"
        />
      </div>
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            {/* About Dropdown - open on hover, show chevron */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className="font-medium transition-colors hover:text-yellow-600 text-gray-700 cursor-pointer flex items-center"
                  onMouseEnter={e => e.currentTarget.click()}
                  onMouseLeave={e => {
                    const menu = document.querySelector('[data-radix-dropdown-menu-content]');
                    if (menu) (menu as HTMLElement).blur();
                  }}
                >
                  About <ChevronDown className="ml-1 w-4 h-4" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/features">Our Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/team">Team</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Get Involved Dropdown */}
            {/* Get Involved Dropdown - open on hover, show chevron */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span
                  className="font-medium transition-colors hover:text-yellow-600 text-gray-700 cursor-pointer flex items-center"
                  onMouseEnter={e => e.currentTarget.click()}
                  onMouseLeave={e => {
                    const menu = document.querySelector('[data-radix-dropdown-menu-content]');
                    if (menu) (menu as HTMLElement).blur();
                  }}
                >
                  Get Involved <ChevronDown className="ml-1 w-4 h-4" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/get-involved#initiatives">Campaigns</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/volunteer">Volunteer</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Link href="/donate">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md font-medium">
                Donate
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
                {/* About Dropdown for Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className="text-lg font-medium cursor-pointer">About</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href="/services" onClick={() => setMobileMenuOpen(false)}>Our Services</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/team" onClick={() => setMobileMenuOpen(false)}>Team</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Get Involved Dropdown for Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className="text-lg font-medium cursor-pointer">Get Involved</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/get-involved#initiatives" onClick={() => setMobileMenuOpen(false)}>Campaigns</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/volunteer" onClick={() => setMobileMenuOpen(false)}>Volunteer</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Gallery</a>
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Contact</a>
                </Link>
                <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Donate
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