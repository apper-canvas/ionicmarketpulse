import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const productService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "specs_c"}},
          {"field": {"Name": "features_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Parse JSON fields and map to expected format
      return response.data.map(product => ({
        ...product,
        images: product.images_c ? JSON.parse(product.images_c) : [],
        specs: product.specs_c ? JSON.parse(product.specs_c) : {},
        features: product.features_c ? JSON.parse(product.features_c) : []
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      toast.error("Failed to load products");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "specs_c"}},
          {"field": {"Name": "features_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Product not found");
      }

      const product = response.data;
      return {
        ...product,
        images: product.images_c ? JSON.parse(product.images_c) : [],
        specs: product.specs_c ? JSON.parse(product.specs_c) : {},
        features: product.features_c ? JSON.parse(product.features_c) : []
      };
    } catch (error) {
      console.error("Error fetching product:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(item) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [
          {
            name_c: item.name_c,
            description_c: item.description_c,
            price_c: item.price_c,
            original_price_c: item.original_price_c,
            discount_c: item.discount_c,
            category_c: item.category_c,
            subcategory_c: item.subcategory_c,
            images_c: JSON.stringify(item.images || []),
            rating_c: item.rating_c,
            review_count_c: item.review_count_c,
            in_stock_c: item.in_stock_c,
            specs_c: JSON.stringify(item.specs || {}),
            features_c: JSON.stringify(item.features || [])
          }
        ]
      };

      const response = await apperClient.createRecord('product_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create product");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Product created successfully");
          return successful[0].data;
        }
      }

      throw new Error("Failed to create product");
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(data.name_c && { name_c: data.name_c }),
            ...(data.description_c && { description_c: data.description_c }),
            ...(data.price_c !== undefined && { price_c: data.price_c }),
            ...(data.original_price_c !== undefined && { original_price_c: data.original_price_c }),
            ...(data.discount_c !== undefined && { discount_c: data.discount_c }),
            ...(data.category_c && { category_c: data.category_c }),
            ...(data.subcategory_c && { subcategory_c: data.subcategory_c }),
            ...(data.images && { images_c: JSON.stringify(data.images) }),
            ...(data.rating_c !== undefined && { rating_c: data.rating_c }),
            ...(data.review_count_c !== undefined && { review_count_c: data.review_count_c }),
            ...(data.in_stock_c !== undefined && { in_stock_c: data.in_stock_c }),
            ...(data.specs && { specs_c: JSON.stringify(data.specs) }),
            ...(data.features && { features_c: JSON.stringify(data.features) })
          }
        ]
      };

      const response = await apperClient.updateRecord('product_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update product");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Product updated successfully");
          return successful[0].data;
        }
      }

      throw new Error("Failed to update product");
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('product_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to delete product");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} products:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Product deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      throw error;
    }
  }
};