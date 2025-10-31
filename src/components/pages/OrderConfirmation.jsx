import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

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
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="font-semibold text-gray-900">
              {new Date(order.date_c).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <Badge variant={order.status_c === 'delivered' ? 'success' : 'warning'} size="md">
              {order.status_c.charAt(0).toUpperCase() + order.status_c.slice(1)}
            </Badge>
          </div>
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
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
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
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Order Summary
        </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
${order.subtotal_c.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold text-gray-900">
                ${order.shipping_c.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold text-gray-900">
                ${order.tax_c.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-lg font-bold border-t border-gray-200 pt-4">
              <span className="text-gray-900">Total</span>
              <span className="text-primary">
                ${order.total_c.toFixed(2)}
              </span>
            </div>
</div>
        </div>

      {/* Shipping Information */}
      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ApperIcon name="MapPin" className="w-5 h-5 mr-2 text-primary" />
          Shipping Address
        </h2>
          
          <div className="space-y-2 text-gray-600">
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
  );
};

export default OrderConfirmation;