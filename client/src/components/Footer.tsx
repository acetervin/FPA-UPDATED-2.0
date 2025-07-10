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
              <Link href="/gallery">
                <a className="block text-gray-400 hover:text-white transition-colors">Gallery</a>
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
          {/* Contact Icons */}
          <div className="flex flex-col space-y-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
                <span style={{ whiteSpace: 'pre-line' }}>
                      Wu Yi Plaza, 3rd Floor, Block E8,<br />
                     Galana Road, Kilimani, Nairobi
                </span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <a href="tel:+254721971194" className="hover:text-white transition-colors">+254 721 971 194</a>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <a href="tel:+254725233261" className="hover:text-white transition-colors">+254 725 233 261</a>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <a href="tel:0208020770" className="hover:text-white transition-colors">0208020770</a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <a href="mailto:kenya@familypeaceassociation.org" className="hover:text-white transition-colors">kenya@familypeaceassociation.org</a>
            </div>
          </div>
        </div>
        {/* Newsletter */}
        <div className="mb-12">
          <Newsletter />
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Family Peace Association. All rights reserved.
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
