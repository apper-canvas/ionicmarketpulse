import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import RatingDisplay from "@/components/molecules/RatingDisplay";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useCart } from "@/hooks/useCart";
import { productService } from "@/services/api/productService";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setError("");

      try {
        const productData = await productService.getById(parseInt(id));
        setProduct(productData);

        const reviewsData = await reviewService.getByProductId(parseInt(id));
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;

    setIsAdding(true);
    
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
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

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Home
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <button 
          onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
          className="hover:text-primary"
        >
          {product.category}
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Title and Category */}
          <div className="space-y-2">
            <Badge variant="outline" size="sm">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating and Reviews */}
          <RatingDisplay
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="lg"
            showCount={true}
          />

          {/* Price */}
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size="xl"
            showDiscount={true}
          />

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name={product.inStock ? "Check" : "X"} 
              className={`w-5 h-5 ${product.inStock ? "text-green-500" : "text-red-500"}`} 
            />
            <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Product Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <ApperIcon name="Check" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          {product.inStock && (
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                  >
                    <ApperIcon name="Minus" className="w-4 h-4" />
                  </Button>
                  
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isAdding ? (
                    <>
                      <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : isInCart(product.Id) ? (
                    <>
                      <ApperIcon name="Check" className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => navigate("/cart")}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  <ApperIcon name="Eye" className="w-5 h-5 mr-2" />
                  View Cart
                </Button>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Truck" className="w-5 h-5 text-primary" />
              <span>Free shipping over $50</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="RotateCcw" className="w-5 h-5 text-primary" />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="Shield" className="w-5 h-5 text-primary" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-16">
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Customer Reviews ({reviews.length})
            </h2>

            <div className="space-y-8">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.Id} className="bg-surface rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <RatingDisplay
                        rating={review.rating}
                        showCount={false}
                        size="sm"
                      />
                      <h4 className="font-semibold text-gray-900">
                        {review.title}
                      </h4>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{review.author}</p>
                      <p>{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {review.content}
                  </p>
                  
                  {review.helpful > 0 && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
                      <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                      <span>{review.helpful} people found this helpful</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;