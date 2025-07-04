import { Link } from "wouter";
import { Heart, MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <div className="space-y-2">
              <Link href="/">
                <a className="block text-gray-400 hover:text-white transition-colors">Home</a>
              </Link>
              <Link href="/about">
                <a className="block text-gray-400 hover:text-white transition-colors">About</a>
              </Link>
              <Link href="/blog">
                <a className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              </Link>
              <Link href="/team">
                <a className="block text-gray-400 hover:text-white transition-colors">Team</a>
              </Link>
              <Link href="/features">
                <a className="block text-gray-400 hover:text-white transition-colors">Features</a>
              </Link>
              <Link href="/donate">
                <a className="block text-gray-400 hover:text-white transition-colors">Donate</a>
              </Link>
              <Link href="/causes">
                <a className="block text-gray-400 hover:text-white transition-colors">Causes</a>
              </Link>
              <Link href="/contact">
                <a className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </Link>
              <Link href="/legal">
                <a className="block text-gray-400 hover:text-white transition-colors">Legal</a>
              </Link>
            </div>
          </div>

          {/* CMS Pages */}
          <div>
            <h4 className="text-lg font-semibold mb-4">CMS Pages</h4>
            <div className="space-y-2">
              <Link href="/blog">
                <a className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              </Link>
              <Link href="/blog/building-communication-bridges">
                <a className="block text-gray-400 hover:text-white transition-colors">Blog Post Page</a>
              </Link>
              <Link href="/causes">
                <a className="block text-gray-400 hover:text-white transition-colors">Causes</a>
              </Link>
              <Link href="/causes/family-counseling-program">
                <a className="block text-gray-400 hover:text-white transition-colors">Causes Page</a>
              </Link>
              <Link href="/team">
                <a className="block text-gray-400 hover:text-white transition-colors">Team Members</a>
              </Link>
              <Link href="/team/dr-sarah-johnson">
                <a className="block text-gray-400 hover:text-white transition-colors">Team Members Page</a>
              </Link>
            </div>
          </div>

          {/* Essential Pages */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Essential Pages</h4>
            <div className="space-y-2">
              <Link href="/style-guide">
                <a className="block text-gray-400 hover:text-white transition-colors">Style Guide</a>
              </Link>
              <Link href="/licenses">
                <a className="block text-gray-400 hover:text-white transition-colors">Licenses</a>
              </Link>
              <Link href="/changelog">
                <a className="block text-gray-400 hover:text-white transition-colors">Changelog</a>
              </Link>
              <Link href="/404">
                <a className="block text-gray-400 hover:text-white transition-colors">404 Page</a>
              </Link>
              <Link href="/password">
                <a className="block text-gray-400 hover:text-white transition-colors">Password Page</a>
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <div className="space-y-2">
              <Link href="/donate">
                <a className="block text-gray-400 hover:text-white transition-colors">Sign Up</a>
              </Link>
              <Link href="/contact">
                <a className="block text-gray-400 hover:text-white transition-colors">Log In</a>
              </Link>
              <Link href="/password">
                <a className="block text-gray-400 hover:text-white transition-colors">Reset password</a>
              </Link>
              <Link href="/contact">
                <a className="block text-gray-400 hover:text-white transition-colors">User account</a>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="mb-12">
          <Newsletter />
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Family Peace Association. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            </Link>
            <Link href="/legal">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            </Link>
            <Link href="/licenses">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">Licenses</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
