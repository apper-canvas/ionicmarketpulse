import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  description = "We couldn't find any items matching your criteria.",
  icon = "Package",
  actionText = "Browse All Products",
  onAction
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon 
            name={icon} 
            className="w-12 h-12 text-gray-400" 
          />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {onAction && (
          <Button 
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <ApperIcon name="ShoppingBag" className="w-4 h-4 mr-2" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;