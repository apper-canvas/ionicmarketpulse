import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ProductGrid from "@/components/organisms/ProductGrid";
import { productService } from "@/services/api/productService";

const Category = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    minRating: 0,
    sortBy: "featured"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Format category name for display
  const displayCategoryName = categoryName
    .replace("-", " ")
    .replace(/\b\w/g, l => l.toUpperCase());

  useEffect(() => {
    const loadCategoryProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await productService.getAll();
        const categoryProducts = allProducts.filter(product => 
          product.category.toLowerCase() === displayCategoryName.toLowerCase() ||
          product.subcategory?.toLowerCase() === displayCategoryName.toLowerCase()
        );
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Failed to load category products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryProducts();
  }, [categoryName, displayCategoryName]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900">{displayCategoryName}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {displayCategoryName}
        </h1>
        <p className="text-lg text-gray-600">
          Discover our curated selection of {displayCategoryName.toLowerCase()} products
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span>Filters</span>
              <ApperIcon 
                name={showFilters ? "ChevronUp" : "ChevronDown"} 
                className="w-4 h-4" 
              />
            </Button>
          </div>

          {/* Filter Panel */}
          <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            {/* Sort By */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Price Range</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handleFilterChange({
                      priceRange: { ...filters.priceRange, min: Number(e.target.value) || 0 }
                    })}
                    className="w-full"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handleFilterChange({
                      priceRange: { ...filters.priceRange, max: Number(e.target.value) || 10000 }
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.minRating === rating}
                      onChange={(e) => handleFilterChange({ minRating: Number(e.target.value) })}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <ApperIcon
                          key={i}
                          name="Star"
                          className={`w-4 h-4 ${
                            i < rating ? "text-accent fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600">& up</span>
                    </div>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={0}
                    checked={filters.minRating === 0}
                    onChange={() => handleFilterChange({ minRating: 0 })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">All Ratings</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              onClick={() => setFilters({
                priceRange: { min: 0, max: 10000 },
                minRating: 0,
                sortBy: "featured"
              })}
              variant="outline"
              className="w-full"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
<ProductGrid
            categoryFilter={displayCategoryName}
            priceRange={filters.priceRange}
            sortBy={filters.sortBy}
            initialLimit={12}
            loadMoreIncrement={12}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;