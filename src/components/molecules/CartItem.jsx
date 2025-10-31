import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PriceDisplay from "@/components/molecules/PriceDisplay";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const CartItem = ({ item, compact = false }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity === quantity) return;

    setIsUpdating(true);
    setQuantity(newQuantity);

    try {
      updateQuantity(item.productId, newQuantity);
      toast.success("Quantity updated", { autoClose: 1500 });
    } catch (error) {
      toast.error("Failed to update quantity");
      setQuantity(item.quantity); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
    toast.success("Item removed from cart", { autoClose: 1500 });
  };

  const incrementQuantity = () => handleQuantityChange(quantity + 1);
  const decrementQuantity = () => handleQuantityChange(Math.max(1, quantity - 1));

  const itemTotal = item.price * quantity;

  if (compact) {
    return (
      <div className="flex items-center space-x-3 py-2">
        <img
          src={item.product?.images?.[0] || "/placeholder-product.jpg"}
          alt={item.product?.name || "Product"}
          className="w-12 h-12 object-cover rounded-lg"
        />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.product?.name || "Product"}
          </p>
          <p className="text-sm text-gray-500">
            Qty: {quantity} × ${item.price.toFixed(2)}
          </p>
        </div>
        
        <div className="text-sm font-semibold text-gray-900">
          ${itemTotal.toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.product?.images?.[0] || "/placeholder-product.jpg"}
            alt={item.product?.name || "Product"}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {item.product?.name || "Product"}
              </h3>
              
              {item.product?.category && (
                <p className="text-sm text-gray-500">
                  {item.product.category}
                </p>
              )}
              
              <PriceDisplay
                price={item.price}
                originalPrice={item.product?.originalPrice}
                discount={item.product?.discount}
                size="sm"
              />
            </div>

            <Button
              onClick={handleRemove}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1 || isUpdating}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </Button>

                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const newQty = parseInt(e.target.value) || 1;
                    setQuantity(newQty);
                  }}
                  onBlur={() => handleQuantityChange(quantity)}
                  className="w-16 text-center"
                  min="1"
                />

                <Button
                  onClick={incrementQuantity}
                  disabled={isUpdating}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ${itemTotal.toFixed(2)}
              </p>
              {quantity > 1 && (
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;