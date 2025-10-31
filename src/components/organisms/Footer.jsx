import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const footerLinks = {
    "Shop": [
      { name: "All Products", path: "/" },
      { name: "Electronics", path: "/category/electronics" },
      { name: "Clothing", path: "/category/clothing" },
      { name: "Home & Garden", path: "/category/home-garden" },
      { name: "Sports", path: "/category/sports" },
      { name: "Books", path: "/category/books" }
    ],
    "Customer Service": [
      { name: "Help Center", path: "#" },
      { name: "Contact Us", path: "#" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns", path: "#" },
      { name: "Size Guide", path: "#" }
    ],
    "Company": [
      { name: "About Us", path: "#" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Sustainability", path: "#" },
      { name: "Affiliate Program", path: "#" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "#" },
    { name: "Twitter", icon: "Twitter", url: "#" },
    { name: "Instagram", icon: "Instagram", url: "#" },
    { name: "YouTube", icon: "Youtube", url: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Stay in the loop
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Get the latest deals, new arrivals, and exclusive offers delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="ShoppingBag" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">MarketPulse</h2>
                <p className="text-xs text-gray-400">Your Shopping Destination</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover amazing products at unbeatable prices. From electronics to fashion, 
              we've got everything you need with fast shipping and excellent customer service.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <ApperIcon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 MarketPulse. All rights reserved.</span>
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">We accept:</span>
              <div className="flex items-center space-x-2">
                <ApperIcon name="CreditCard" className="w-8 h-8 text-gray-400" />
                <ApperIcon name="Banknote" className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;