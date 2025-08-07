import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
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

  const NavLink = ({
    href,
    children,
    className = "",
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={onClick}
      className={`font-medium transition-colors hover:text-yellow-600 ${
        isActive(href) ? "text-yellow-600 font-semibold" : "text-gray-700"
      } ${className}`}
    >
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
                  onMouseEnter={(e) => e.currentTarget.click()}
                  onMouseLeave={(e) => {
                    const menu = document.querySelector(
                      "[data-radix-dropdown-menu-content]"
                    );
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
                  onMouseEnter={(e) => e.currentTarget.click()}
                  onMouseLeave={(e) => {
                    const menu = document.querySelector(
                      "[data-radix-dropdown-menu-content]"
                    );
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
                  <Link href="/get-involved#initiatives">Campaigns & Volunteers</Link>
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
            <SheetContent
              side="right"
              className="w-full max-w-sm p-0 flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <Logo />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
              </div>

              <div className="flex-grow p-6 overflow-y-auto">
                <div className="flex flex-col space-y-2">
                  <NavLink
                    href="/"
                    className="text-lg py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </NavLink>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="about" className="border-b-0">
                      <AccordionTrigger className="text-lg font-medium hover:no-underline py-2">
                        About
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 pl-4 pt-2">
                          <NavLink
                            href="/features"
                            className="text-base"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Our Services
                          </NavLink>
                          <NavLink
                            href="/about"
                            className="text-base"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            About Us
                          </NavLink>
                          <NavLink
                            href="/team"
                            className="text-base"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Team
                          </NavLink>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="get-involved"
                      className="border-b-0"
                    >
                      <AccordionTrigger className="text-lg font-medium hover:no-underline py-2">
                        Get Involved
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 pl-4 pt-2">
                          <NavLink
                            href="/blog"
                            className="text-base"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Blog
                          </NavLink>
                          <NavLink
                            href="/get-involved#initiatives"
                            className="text-base"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Campaigns & Volunteers
                          </NavLink>
                         
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <NavLink
                    href="/gallery"
                    className="text-lg py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Gallery
                  </NavLink>
                  <NavLink
                    href="/contact"
                    className="text-lg py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </NavLink>
                </div>
              </div>
              <div className="p-6 mt-auto border-t">
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
