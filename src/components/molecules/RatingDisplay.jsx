import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const RatingDisplay = ({ 
  rating = 0, 
  reviewCount = 0, 
  size = "md", 
  showCount = true,
  className 
}) => {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon
          key={`full-${i}`}
          name="Star"
          className={cn(sizes[size], "text-accent fill-current")}
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <ApperIcon
            name="Star"
            className={cn(sizes[size], "text-gray-300")}
          />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <ApperIcon
              name="Star"
              className={cn(sizes[size], "text-accent fill-current")}
            />
          </div>
        </div>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon
          key={`empty-${i}`}
          name="Star"
          className={cn(sizes[size], "text-gray-300")}
        />
      );
    }

    return stars;
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-0.5">
        {renderStars()}
      </div>
      
      <div className="flex items-center space-x-1">
        <span className={cn("font-medium text-gray-900", textSizes[size])}>
          {rating.toFixed(1)}
        </span>
        
        {showCount && reviewCount > 0 && (
          <span className={cn("text-gray-500", textSizes[size])}>
            ({reviewCount.toLocaleString()})
          </span>
        )}
      </div>
    </div>
  );
};

export default RatingDisplay;