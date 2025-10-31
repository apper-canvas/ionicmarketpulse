import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SearchBar = ({ className, placeholder = "Search for products..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Navigate to home with search query
    navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    setIsLoading(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name={isLoading ? "Loader2" : "Search"} 
            className={cn(
              "w-5 h-5 text-gray-400",
              isLoading && "animate-spin"
            )} 
          />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20 py-3 text-base bg-white/90 backdrop-blur-sm border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        
        {searchTerm && (
          <div className="absolute inset-y-0 right-12 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button
            type="submit"
            disabled={!searchTerm.trim() || isLoading}
            className="h-10 px-6 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;