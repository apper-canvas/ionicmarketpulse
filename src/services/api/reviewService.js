import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const reviewService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "helpful_c"}},
          {"field": {"Name": "product_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error?.response?.data?.message || error);
      toast.error("Failed to load reviews");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('review_c', parseInt(id), {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "helpful_c"}},
          {"field": {"Name": "product_id_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Review not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByProductId(productId) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "helpful_c"}},
          {"field": {"Name": "product_id_c"}}
        ],
        where: [
          {
            "FieldName": "product_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(productId)]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching product reviews:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(item) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [
          {
            title_c: item.title_c,
            content_c: item.content_c,
            author_c: item.author_c,
            date_c: item.date_c || new Date().toISOString(),
            rating_c: item.rating_c,
            helpful_c: item.helpful_c || 0,
            product_id_c: item.product_id_c
          }
        ]
      };

      const response = await apperClient.createRecord('review_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create review");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Review created successfully");
          return successful[0].data;
        }
      }

      throw new Error("Failed to create review");
    } catch (error) {
      console.error("Error creating review:", error?.response?.data?.message || error);
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
            ...(data.title_c && { title_c: data.title_c }),
            ...(data.content_c && { content_c: data.content_c }),
            ...(data.author_c && { author_c: data.author_c }),
            ...(data.date_c && { date_c: data.date_c }),
            ...(data.rating_c !== undefined && { rating_c: data.rating_c }),
            ...(data.helpful_c !== undefined && { helpful_c: data.helpful_c }),
            ...(data.product_id_c !== undefined && { product_id_c: data.product_id_c })
          }
        ]
      };

      const response = await apperClient.updateRecord('review_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update review");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Review updated successfully");
          return successful[0].data;
        }
      }

      throw new Error("Failed to update review");
    } catch (error) {
      console.error("Error updating review:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('review_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to delete review");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} reviews:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Review deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting review:", error?.response?.data?.message || error);
      throw error;
    }
  }
};