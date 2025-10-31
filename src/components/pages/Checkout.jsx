import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CartItem from "@/components/molecules/CartItem";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });
  const [errors, setErrors] = useState({});

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        items: cartItems,
        subtotal: cartTotal,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        shippingAddress: formData,
        date: new Date().toISOString(),
        status: "processing"
      };

      const order = await orderService.create(orderData);
      
      // Clear cart and redirect to confirmation
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.Id}`);
      
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Checkout
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Shield" className="w-4 h-4 text-green-500" />
          <span>Secure checkout • SSL encrypted</span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Shipping Information
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Street Address *
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={!!errors.address}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={!!errors.city}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={!!errors.state}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    ZIP Code *
                  </label>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={!!errors.zipCode}
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600">{errors.zipCode}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Payment Information */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Method
              </h2>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
              <ApperIcon name="Info" className="w-5 h-5 text-blue-500" />
              <p className="text-sm text-blue-700">
                For demo purposes, payment processing is simulated. Your order will be confirmed without actual payment.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="bg-surface rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} compact={true} />
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-900">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold text-gray-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-lg font-bold border-t border-gray-200 pt-4">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                  Place Order
                </>
              )}
            </Button>

            {/* Security Info */}
            <div className="text-center text-xs text-gray-500 mt-4 space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <ApperIcon name="Shield" className="w-3 h-3 text-green-500" />
                <span>256-bit SSL encryption</span>
              </div>
              <p>Your information is secure and protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;