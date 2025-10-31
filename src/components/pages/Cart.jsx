import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
          icon="ShoppingCart"
          actionText="Start Shopping"
          onAction={() => navigate("/")}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart ({cartCount} items)
        </h1>
        
        <Button
          onClick={clearCart}
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
          
          {/* Continue Shopping */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="bg-surface rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Shipping</span>
                  {cartTotal >= 50 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              {/* Tax */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-semibold text-gray-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {cartTotal < 50 && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Free shipping progress</span>
                    <span className="font-semibold text-blue-900">
                      ${(50 - cartTotal).toFixed(2)} to go
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={() => navigate("/checkout")}
              size="lg"
              className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-600">
              <ApperIcon name="Shield" className="w-4 h-4 text-green-500" />
              <span>Secure checkout guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;