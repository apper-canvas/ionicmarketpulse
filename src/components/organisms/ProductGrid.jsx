import React, { useState, useEffect } from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { cn } from "@/utils/cn";

const ProductGrid = ({ 
  categoryFilter = null, 
  searchTerm = "", 
  priceRange = { min: 0, max: 10000 },
  sortBy = "featured",
  viewMode = "grid" 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoading(false);
    } else {
      setLoading(true);
      setError("");
    }

    try {
      let allProducts = await productService.getAll();
      
      // Apply filters
      if (categoryFilter) {
        allProducts = allProducts.filter(product => 
          product.category.toLowerCase() === categoryFilter.toLowerCase() ||
          product.subcategory?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        allProducts = allProducts.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        );
      }

      // Apply price filter
      allProducts = allProducts.filter(product =>
        product.price >= priceRange.min && product.price <= priceRange.max
      );

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          allProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          allProducts.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          allProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          allProducts.sort((a, b) => b.Id - a.Id);
          break;
        default: // featured
          allProducts.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
      }

      // Simulate pagination
      const itemsPerPage = 12;
      const startIndex = isLoadMore ? (page - 1) * itemsPerPage : 0;
      const endIndex = page * itemsPerPage;
      const paginatedProducts = allProducts.slice(0, endIndex);

      setProducts(paginatedProducts);
      setHasMore(allProducts.length > endIndex);
      
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    setPage(1);
    loadProducts();
  }, [categoryFilter, searchTerm, priceRange, sortBy]);

  useEffect(() => {
    if (page > 1) {
      loadProducts(true);
    }
  }, [page]);

  if (loading && products.length === 0) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={() => loadProducts()} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        description={searchTerm 
          ? `We couldn't find any products matching "${searchTerm}"`
          : "No products available in this category"
        }
        icon="Package"
        actionText="Browse All Categories"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {products.length} products
          {searchTerm && (
            <span className="ml-1">
              for "<span className="font-semibold text-gray-900">{searchTerm}</span>"
            </span>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {}} // View mode toggle would be handled by parent
            className="p-2"
          >
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="sm"
            onClick={() => {}} // View mode toggle would be handled by parent
            className="p-2"
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      )}>
        {products.map((product) => (
          <ProductCard
            key={product.Id}
            product={product}
            className={viewMode === "list" ? "max-w-none" : ""}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <Button
            onClick={loadMore}
            disabled={loading}
            size="lg"
            variant="outline"
            className="px-8"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Load More Products
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;