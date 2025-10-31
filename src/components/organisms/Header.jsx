import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { cn } from "@/utils/cn";
const Header = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount } = useCart();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Electronics", icon: "Smartphone" },
    { name: "Clothing", icon: "Shirt" },
    { name: "Home & Garden", icon: "Home" },
    { name: "Sports", icon: "Dumbbell" },
    { name: "Books", icon: "Book" },
    { name: "Beauty", icon: "Sparkles" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">Free shipping on orders over $50!</span>
              <ApperIcon name="Truck" className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Need help? Call 1-800-MARKET</span>
              <ApperIcon name="Phone" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="ShoppingBag" className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                MarketPulse
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Your Shopping Destination</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Action Buttons */}
<div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => navigate("/?mobile-search=true")}
            >
              <ApperIcon name="Search" className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative p-2"
            >
              <ApperIcon name="ShoppingCart" className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge 
                  variant="accent" 
                  size="xs"
                  className="absolute -top-1 -right-1 min-w-[1.5rem] h-6 flex items-center justify-center"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Button>

            {/* User Menu / Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2"
                >
                  <ApperIcon name="User" className="w-5 h-5" />
                </Button>
                
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.emailAddress}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <ApperIcon name="LogOut" className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="p-2"
              >
                <ApperIcon name="LogIn" className="w-5 h-5" />
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Navigation - Desktop */}
      <div className="hidden lg:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <nav className="flex items-center space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/category/${category.name.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200 group"
                >
                  <ApperIcon 
                    name={category.icon} 
                    className="w-4 h-4 text-gray-400 group-hover:text-primary" 
                  />
                  <span>{category.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4 text-sm">
              <Link 
                to="/?deals=true" 
                className="flex items-center space-x-1 text-accent font-medium hover:text-yellow-600 transition-colors"
              >
                <ApperIcon name="Zap" className="w-4 h-4" />
                <span>Today's Deals</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <SearchBar placeholder="Search products..." />
            
            {/* Mobile Categories */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/category/${category.name.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name={category.icon} className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Link
                to="/?deals=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-accent font-medium"
              >
                <ApperIcon name="Zap" className="w-4 h-4" />
                <span>Today's Deals</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;