import React, { useEffect, useState } from "react";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import ProductCard from "@/components/molecules/ProductCard";
import { cn } from "@/utils/cn";

const ProductGrid = ({ 
  categoryFilter = null, 
  searchTerm = "",
  priceRange = { min: 0, max: 10000 },
  sortBy = "featured",
  viewMode = "grid",
  initialLimit = 12,
  loadMoreIncrement = 12
}) => {
  const normalizeString = (str) => {
    if (!str) return '';
    return str
.toLowerCase()
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b(and|&)\b/gi, (match) => match === '&' ? 'and' : '&')
      .trim();
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(initialLimit);

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + loadMoreIncrement);
  };

useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
let allProducts = await productService.getAll();
        
        // Apply filters
        if (categoryFilter) {
          const normalizedFilter = normalizeString(categoryFilter);
          allProducts = allProducts.filter(product => 
            normalizeString(product.category_c) === normalizedFilter ||
            normalizeString(product.subcategory_c) === normalizedFilter
          );
        }

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          allProducts = allProducts.filter(product =>
            product.name_c?.toLowerCase().includes(term) ||
            product.description_c?.toLowerCase().includes(term) ||
            product.category_c?.toLowerCase().includes(term)
          );
        }

        // Apply price filter
        allProducts = allProducts.filter(product =>
          product.price_c >= priceRange.min && product.price_c <= priceRange.max
        );

        // Apply sorting
        switch (sortBy) {
          case "price-low":
            allProducts.sort((a, b) => a.price_c - b.price_c);
            break;
          case "price-high":
            allProducts.sort((a, b) => b.price_c - a.price_c);
            break;
          case "rating":
            allProducts.sort((a, b) => (b.rating_c || 0) - (a.rating_c || 0));
            break;
          case "newest":
            allProducts.sort((a, b) => (b.Id || 0) - (a.Id || 0));
            break;
          default: // featured
            allProducts.sort((a, b) => 
              ((b.rating_c || 0) * (b.review_count_c || 0)) - ((a.rating_c || 0) * (a.review_count_c || 0))
            );
        }
        setProducts(allProducts);
        
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
loadProducts();
  }, [categoryFilter, searchTerm, priceRange, sortBy]);
  // Apply display limit
  const displayedProducts = products.slice(0, displayLimit);
  const hasMoreProducts = products.length > displayLimit;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

if (displayedProducts.length === 0) {
    const displayCategoryName = categoryFilter 
      ? categoryFilter.replace(/-/g, ' ').replace(/\s+/g, ' ').replace(/\band\b/gi, '&').trim().replace(/\b\w/g, l => l.toUpperCase())
      : '';
    
    return (
      <Empty
        title="No Products Found"
        description={
          searchTerm
            ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search or filters.`
            : categoryFilter
            ? `No products available in ${displayCategoryName}`
            : "No products available"
        }
        icon="Package"
        actionText="Browse All Categories"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      )}>
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.Id}
            product={product}
            className={viewMode === "list" ? "max-w-none" : ""}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className="text-center pt-8">
          <Button
            onClick={handleLoadMore}
            size="lg"
            variant="outline"
            className="px-8"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;