import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href}>
      <a className={`font-medium transition-colors hover:text-green-600 ${isActive(href) ? 'text-green-600 font-semibold' : 'text-gray-700'} ${className}`}>
        {children}
      </a>
    </Link>
  );

  const Logo = () => (
    <Link href="/">
      <a className="text-2xl font-bold text-gray-900">
        Family Peace Association
      </a>
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
            <NavLink href="/about">About</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            
            <Link href="/get-involved">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium">
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
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">About</a>
                </Link>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Blog</a>
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <a className="text-lg font-medium">Contact</a>
                </Link>
                <Link href="/get-involved" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
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