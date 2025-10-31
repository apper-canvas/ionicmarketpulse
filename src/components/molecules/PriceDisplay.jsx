import React from "react";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  discount = 0,
  size = "md",
  showDiscount = true,
  className 
}) => {
  const hasDiscount = discount > 0 && originalPrice > price;
  
  const priceSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl"
  };
  
  const originalPriceSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-baseline space-x-2">
        <span className={cn(
          "font-bold text-gray-900",
          priceSizes[size]
        )}>
          {formatPrice(price)}
        </span>
        
        {hasDiscount && (
          <span className={cn(
            "font-medium text-gray-500 line-through",
            originalPriceSizes[size]
          )}>
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      
      {hasDiscount && showDiscount && (
        <Badge variant="accent" size="xs">
          {discount}% OFF
        </Badge>
      )}
    </div>
  );
};

export default PriceDisplay;