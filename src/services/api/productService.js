import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";

/**
 * Product Service - Handles all product data operations using ApperClient
 * Integrates with product_c table in Apper backend
 */
/**
 * Get all products from database
 * @returns {Promise<Array>} Array of product objects
 */
export const getAll = async () => {
  try {
    const apperClient = getApperClient()
    
    if (!apperClient) {
      console.error('ApperClient not initialized')
      toast.error('Unable to connect to database')
      return []
    }

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'description_c' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'subcategory_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'stock_quantity_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'review_count_c' } },
        { field: { Name: 'is_featured_c' } },
        { field: { Name: 'discount_percentage_c' } },
        { field: { Name: 'original_price_c' } }
      ],
      pagingInfo: {
        limit: 1000,
        offset: 0
      }
    }

    const response = await apperClient.fetchRecords('product_c', params)

    if (!response.success) {
      console.error('Failed to fetch products:', response.message)
      toast.error(response.message || 'Failed to load products')
      return []
    }

    return response.data || []
  } catch (error) {
    console.error('Error fetching products:', error?.message || error)
    toast.error('An error occurred while loading products')
    return []
  }
}

/**
 * Get product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} Product object or null
 */
export const getById = async (id) => {
  try {
    const apperClient = getApperClient()
    
    if (!apperClient) {
      console.error('ApperClient not initialized')
      toast.error('Unable to connect to database')
      return null
    }

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'description_c' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'subcategory_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'stock_quantity_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'review_count_c' } },
        { field: { Name: 'is_featured_c' } },
        { field: { Name: 'discount_percentage_c' } },
        { field: { Name: 'original_price_c' } }
      ]
    }

    const response = await apperClient.getRecordById('product_c', parseInt(id), params)

    if (!response.success) {
      console.error(`Failed to fetch product ${id}:`, response.message)
      toast.error(response.message || 'Failed to load product')
      return null
    }

    return response.data || null
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error?.message || error)
    toast.error('An error occurred while loading product details')
    return null
  }
}

/**
 * Get featured products
 * @returns {Promise<Array>} Array of featured product objects
 */
export const getFeatured = async () => {
  try {
    const apperClient = getApperClient()
    
    if (!apperClient) {
      console.error('ApperClient not initialized')
      toast.error('Unable to connect to database')
      return []
    }

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'description_c' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'review_count_c' } },
        { field: { Name: 'discount_percentage_c' } },
        { field: { Name: 'original_price_c' } }
      ],
      where: [
        {
          FieldName: 'is_featured_c',
          Operator: 'EqualTo',
          Values: [true]
        }
      ],
      pagingInfo: {
        limit: 20,
        offset: 0
      }
    }

    const response = await apperClient.fetchRecords('product_c', params)

    if (!response.success) {
      console.error('Failed to fetch featured products:', response.message)
      toast.error(response.message || 'Failed to load featured products')
      return []
    }

    return response.data || []
  } catch (error) {
    console.error('Error fetching featured products:', error?.message || error)
    toast.error('An error occurred while loading featured products')
    return []
  }
}

/**
 * Get products by category or subcategory
 * @param {string} category - Category or subcategory name
 * @returns {Promise<Array>} Array of product objects
 */
export const getByCategory = async (category) => {
  try {
    const apperClient = getApperClient()
    
    if (!apperClient) {
      console.error('ApperClient not initialized')
      toast.error('Unable to connect to database')
      return []
    }

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'description_c' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'subcategory_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'stock_quantity_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'review_count_c' } },
        { field: { Name: 'discount_percentage_c' } },
        { field: { Name: 'original_price_c' } }
      ],
      whereGroups: [
        {
          operator: 'OR',
          subGroups: [
            {
              conditions: [
                {
                  fieldName: 'category_c',
                  operator: 'Contains',
                  values: [category]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: 'subcategory_c',
                  operator: 'Contains',
                  values: [category]
                }
              ]
            }
          ]
        }
      ],
      pagingInfo: {
        limit: 1000,
        offset: 0
      }
    }

    const response = await apperClient.fetchRecords('product_c', params)

    if (!response.success) {
      console.error(`Failed to fetch products for category ${category}:`, response.message)
      toast.error(response.message || 'Failed to load products')
      return []
    }

    return response.data || []
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error?.message || error)
    toast.error('An error occurred while loading products')
    return []
  }
}

/**
 * Search products by term
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} Array of matching product objects
 */
export const searchProducts = async (searchTerm) => {
  try {
    const apperClient = getApperClient()
    
    if (!apperClient) {
      console.error('ApperClient not initialized')
      toast.error('Unable to connect to database')
      return []
    }

    const params = {
      fields: [
        { field: { Name: 'Id' } },
        { field: { Name: 'name_c' } },
        { field: { Name: 'description_c' } },
        { field: { Name: 'price_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'image_url_c' } },
        { field: { Name: 'rating_c' } },
        { field: { Name: 'review_count_c' } },
        { field: { Name: 'discount_percentage_c' } },
        { field: { Name: 'original_price_c' } }
      ],
      whereGroups: [
        {
          operator: 'OR',
          subGroups: [
            {
              conditions: [
                {
                  fieldName: 'name_c',
                  operator: 'Contains',
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: 'description_c',
                  operator: 'Contains',
                  values: [searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: 'category_c',
                  operator: 'Contains',
                  values: [searchTerm]
                }
              ]
            }
          ]
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    }

    const response = await apperClient.fetchRecords('product_c', params)

    if (!response.success) {
      console.error(`Failed to search products for term "${searchTerm}":`, response.message)
      toast.error(response.message || 'Failed to search products')
      return []
    }

    return response.data || []
  } catch (error) {
    console.error(`Error searching products for term "${searchTerm}":`, error?.message || error)
    toast.error('An error occurred while searching products')
    return []
  }
}

export const productService = {
  getAll,
  getById,
  getFeatured,
  getByCategory,
  searchProducts
}