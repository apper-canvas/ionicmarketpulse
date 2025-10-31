import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import RatingDisplay from "@/components/molecules/RatingDisplay";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const ProductCard = ({ product, className }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product.inStock) return;

    setIsAdding(true);
    
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.Id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group bg-surface rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden",
        "transform hover:scale-[1.02] hover:-translate-y-1",
        "border border-gray-100 hover:border-gray-200",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <Badge
            variant="accent"
            className="absolute top-3 left-3 shadow-md"
          >
            -{product.discount}%
          </Badge>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger" size="md">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 transition-opacity duration-200",
          isHovered && "opacity-100"
        )}>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm"
            size="sm"
          >
            {isAdding ? (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : isInCart(product.Id) ? (
              <>
                <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <RatingDisplay
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
        />

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
          />
          
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            variant={isInCart(product.Id) ? "ghost" : "primary"}
            size="sm"
            className="shrink-0"
          >
            {isAdding ? (
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
            ) : isInCart(product.Id) ? (
              <ApperIcon name="Check" className="w-4 h-4" />
            ) : (
              <ApperIcon name="ShoppingCart" className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;