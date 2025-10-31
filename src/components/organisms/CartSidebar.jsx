import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/utils/cn";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300",
        "flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ApperIcon name="ShoppingCart" className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({cartCount})
            </h2>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="ShoppingCart" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some products to get started
              </p>
              <Button onClick={onClose} variant="primary">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.productId} 
                  item={item} 
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                size="lg"
              >
                <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                Checkout
              </Button>
              
              <Button
                onClick={handleViewCart}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                View Full Cart
              </Button>
            </div>

            {/* Clear Cart */}
            <Button
              onClick={() => {
                clearCart();
                onClose();
              }}
              variant="ghost"
              className="w-full text-gray-500 hover:text-red-600"
              size="sm"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;