import { useState, useEffect, useCallback } from "react";
import { productService } from "@/services/api/productService";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("marketpulse_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        loadCartWithProducts(parsedCart);
      } catch (error) {
        console.error("Failed to parse saved cart:", error);
        localStorage.removeItem("marketpulse_cart");
      }
    }
  }, []);

  // Load full product details for cart items
  const loadCartWithProducts = async (cartData) => {
    try {
      const itemsWithProducts = await Promise.all(
        cartData.map(async (item) => {
          try {
            const product = await productService.getById(parseInt(item.productId));
            return {
              ...item,
              product
            };
          } catch (error) {
            console.error(`Failed to load product ${item.productId}:`, error);
            return null;
          }
        })
      );

      // Filter out null items (products that couldn't be loaded)
      const validItems = itemsWithProducts.filter(item => item !== null);
      setCartItems(validItems);
    } catch (error) {
      console.error("Failed to load cart products:", error);
    }
  };

  // Save cart to localStorage
  const saveCart = useCallback((items) => {
    const cartData = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      selectedOptions: item.selectedOptions || {}
    }));
    localStorage.setItem("marketpulse_cart", JSON.stringify(cartData));
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.Id.toString());
      
      let newItems;
      if (existingItem) {
        // Update quantity of existing item
        newItems = prevItems.map(item =>
          item.productId === product.Id.toString()
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          productId: product.Id.toString(),
          quantity,
          price: product.price,
          selectedOptions: {},
          product
        };
        newItems = [...prevItems, newItem];
      }
      
      saveCart(newItems);
      return newItems;
    });
  }, [saveCart]);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.productId !== productId.toString());
      saveCart(newItems);
      return newItems;
    });
  }, [saveCart]);

  // Update item quantity
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.productId === productId.toString()
          ? { ...item, quantity: newQuantity }
          : item
      );
      saveCart(newItems);
      return newItems;
    });
  }, [removeFromCart, saveCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("marketpulse_cart");
  }, []);

  // Check if product is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.productId === productId.toString());
  }, [cartItems]);

  // Get item quantity
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.productId === productId.toString());
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Calculate totals
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };
};