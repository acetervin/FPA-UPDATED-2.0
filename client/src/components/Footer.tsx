import { Link } from "wouter";
import { Heart, MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";
import Newsletter from "./Newsletter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Family Peace Association</h3>
                <p className="text-gray-400 text-sm">Building Stronger Families Together</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Together, we promote healthy family relationships, provide crisis intervention, and drive meaningful change in our communities.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/">
                <a className="block text-gray-400 hover:text-white transition-colors">Home</a>
              </Link>
              <Link href="/about">
                <a className="block text-gray-400 hover:text-white transition-colors">About</a>
              </Link>
              <Link href="/features">
                <a className="block text-gray-400 hover:text-white transition-colors">Services</a>
              </Link>
              <Link href="/blog">
                <a className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              </Link>
              <Link href="/contact">
                <a className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </Link>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">123 Peace Ave, Community City, PC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">(555) 123-PEACE</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">info@familypeace.org</span>
              </div>
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
