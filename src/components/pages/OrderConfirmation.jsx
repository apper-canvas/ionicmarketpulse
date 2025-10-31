import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { orderService } from "@/services/api/orderService";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError("");

      try {
        const orderData = await orderService.getById(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <Error 
        message={error} 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="Check" className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-700">Order Number:</span>
            <span className="text-sm font-bold text-green-900">#{order.Id.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-8">
        {/* Order Status */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Status
          </h2>
          
          <div className="flex items-center space-x-4">
            <Badge variant="primary" size="md">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <span className="text-gray-600">
              Placed on {new Date(order.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Info" className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• We'll prepare your items for shipment</li>
                  <li>• You'll receive a tracking number via email</li>
                  <li>• Your order will be delivered within 3-5 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Items ({order.items.length})
          </h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                <img
                  src={item.product?.images?.[0] || "/placeholder-product.jpg"}
                  alt={item.product?.name || "Product"}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.product?.name || "Product"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-gray-900">
                ${order.shipping.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold text-gray-900">
                ${order.tax.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-lg font-bold border-t border-gray-200 pt-4">
              <span className="text-gray-900">Total</span>
              <span className="text-primary">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Shipping Address
          </h2>
          
          <div className="text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2">
              <span className="text-gray-900 font-medium">Email:</span> {order.shippingAddress.email}
            </p>
            <p>
              <span className="text-gray-900 font-medium">Phone:</span> {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <ApperIcon name="ShoppingBag" className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
          
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="lg"
          >
            <ApperIcon name="Printer" className="w-5 h-5 mr-2" />
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;