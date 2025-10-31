import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-background">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ApperIcon name="Package" className="w-16 h-16 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Sorry, we couldn't find the page you're looking for. 
              The product or page may have been moved or no longer exists.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
            size="lg"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Electronics", path: "/category/electronics" },
              { name: "Clothing", path: "/category/clothing" },
              { name: "Home & Garden", path: "/category/home-garden" },
              { name: "Sports", path: "/category/sports" }
            ].map((category) => (
              <Button
                key={category.name}
                onClick={() => navigate(category.path)}
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-blue-50"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;