import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { productService } from "@/services/api/productService";
import { reviewService } from "@/services/api/reviewService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Home from "@/components/pages/Home";
import Cart from "@/components/pages/Cart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import RatingDisplay from "@/components/molecules/RatingDisplay";

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
onClick={() => navigate(`/category/${product.category_c.toLowerCase()}`)}
          className="hover:text-primary"
        >
          {product.category_c}
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900">{product.name_c}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
src={product.images[selectedImage]}
              alt={product.name_c}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
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
                    alt={`${product.name_c} ${index + 1}`}
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
{product.category_c}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name_c}
            </h1>
          </div>

          {/* Rating */}
          <RatingDisplay
            rating={product.rating_c}
            reviewCount={product.review_count_c}
            size="lg"
            className="mb-6"
          />

          {/* Price */}
          <PriceDisplay
            price={product.price_c}
            originalPrice={product.original_price_c}
            discount={product.discount_c}
            size="xl"
            showDiscount={true}
            className="mb-6"
          />

          {/* Stock Status */}
          <div className="flex items-center space-x-2 mb-6">
            <ApperIcon 
              name={product.in_stock_c ? "Check" : "X"} 
              className={`w-5 h-5 ${product.in_stock_c ? "text-green-500" : "text-red-500"}`} 
            />
            <span className={`font-medium ${product.in_stock_c ? "text-green-600" : "text-red-600"}`}>
              {product.in_stock_c ? "In Stock" : "Out of Stock"}
            </span>
          </div>

{/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description_c}
            </p>
          </div>
          {/* Features */}
{product.features && product.features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h2>
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

          {/* Add to Cart Section */}
          {product.in_stock_c && (
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
                <div key={review.Id} className="bg-surface rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <RatingDisplay
                        rating={review.rating_c}
                        reviewCount={0}
                        showCount={false}
                        size="sm"
                      />
                      <h4 className="font-semibold text-gray-900 mt-2">
                        {review.title_c}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <p>{review.author_c}</p>
                    <p>{new Date(review.date_c).toLocaleDateString()}</p>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {review.content_c}
                  </p>

                  {review.helpful_c > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ApperIcon name="ThumbsUp" className="w-4 h-4" />
                      <span>{review.helpful_c} people found this helpful</span>
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