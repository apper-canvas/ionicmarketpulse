import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductGrid from "@/components/organisms/ProductGrid";
import { productService } from "@/services/api/productService";

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const deals = searchParams.get("deals") === "true";
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadFeaturedData = async () => {
      try {
        const products = await productService.getAll();
        
        // Get featured products (highest rated with most reviews)
        const featured = products
          .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
          .slice(0, 4);
        setFeaturedProducts(featured);

        // Get unique categories
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        setCategories(uniqueCategories.slice(0, 6));
      } catch (error) {
        console.error("Failed to load featured data:", error);
      }
    };

    if (!searchTerm && !deals) {
      loadFeaturedData();
    }
  }, [searchTerm, deals]);

  // If searching or viewing deals, show filtered results
  if (searchTerm || deals) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {searchTerm && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Results for "{searchTerm}"
              </h1>
              <p className="text-gray-600">
                Discover products matching your search
              </p>
            </div>
          )}
          
          {deals && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Today's Deals
              </h1>
              <p className="text-gray-600">
                Limited time offers and special discounts
              </p>
            </div>
          )}
        </div>

        <ProductGrid 
          searchTerm={searchTerm}
          // For deals, we could add a filter for discounted products
          priceRange={deals ? { min: 0, max: 10000 } : { min: 0, max: 10000 }}
          sortBy={deals ? "price-low" : "featured"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="accent" size="md" className="mx-auto">
                ✨ New Arrivals Weekly
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Discover Amazing Products at
                <span className="block bg-gradient-to-r from-yellow-400 to-accent bg-clip-text text-transparent">
                  Unbeatable Prices
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Shop the latest trends in electronics, fashion, home goods, and more. 
                Fast shipping, easy returns, and customer satisfaction guaranteed.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="xl" className="bg-white text-primary hover:bg-gray-100 shadow-xl">
                <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              <Button 
                size="xl" 
                variant="ghost"
                className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm"
              >
                <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
                View Deals
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/20 rounded-full blur-lg"></div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const categoryIcons = {
              "Electronics": "Smartphone",
              "Clothing": "Shirt",
              "Home & Garden": "Home",
              "Sports": "Dumbbell",
              "Books": "Book",
              "Beauty": "Sparkles"
            };
            
            return (
              <Link
                key={category}
                to={`/category/${category.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                className="group text-center p-6 bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:from-primary/20 group-hover:to-blue-200 transition-colors duration-300">
                  <ApperIcon 
                    name={categoryIcons[category] || "Package"} 
                    className="w-8 h-8 text-primary" 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {category}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Hand-picked favorites from our collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.Id}
                  className="bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <Badge
                        variant="accent"
                        className="absolute top-4 left-4 shadow-md"
                      >
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-accent fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.reviewCount})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        to={`/product/${product.Id}`}
                        className="text-primary hover:text-blue-600 font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Offers Banner */}
      <section className="bg-gradient-to-r from-accent to-yellow-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Limited Time Offers
            </h2>
            <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
              Don't miss out on incredible savings. These deals won't last long!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
                <ApperIcon name="Truck" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                <p className="text-yellow-100">On orders over $50</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
                <ApperIcon name="RotateCcw" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                <p className="text-yellow-100">30-day return policy</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
                <ApperIcon name="Shield" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-yellow-100">Your data is protected</p>
              </div>
            </div>
            
            <Button 
              size="xl" 
              className="bg-white text-accent hover:bg-gray-100 shadow-xl mt-8"
            >
              <ApperIcon name="Tag" className="w-5 h-5 mr-2" />
              Shop All Deals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;