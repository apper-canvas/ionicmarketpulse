import React from "react";

const Loading = () => {
  return (
    <div className="min-h-[400px] bg-background">
      {/* Hero Banner Skeleton */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-surface rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;