import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const orderService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('order_c', {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Parse JSON fields
      return response.data.map(order => ({
        ...order,
        items: order.items_c ? JSON.parse(order.items_c) : [],
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {}
      }));
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error);
      toast.error("Failed to load orders");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('order_c', parseInt(id), {
        fields: [
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Order not found");
      }

      const order = response.data;
      return {
        ...order,
        items: order.items_c ? JSON.parse(order.items_c) : [],
        shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {}
      };
    } catch (error) {
      console.error("Error fetching order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(item) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [
          {
            date_c: item.date || new Date().toISOString(),
            items_c: JSON.stringify(item.items || []),
            shipping_c: item.shipping,
            shipping_address_c: JSON.stringify(item.shippingAddress || {}),
            status_c: item.status,
            subtotal_c: item.subtotal,
            tax_c: item.tax,
            total_c: item.total
          }
        ]
      };

      const response = await apperClient.createRecord('order_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create order");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Order created successfully");
          const order = successful[0].data;
          return {
            ...order,
            items: order.items_c ? JSON.parse(order.items_c) : [],
            shippingAddress: order.shipping_address_c ? JSON.parse(order.shipping_address_c) : {}
          };
        }
      }

      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
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
            ...(data.date && { date_c: data.date }),
            ...(data.items && { items_c: JSON.stringify(data.items) }),
            ...(data.shipping !== undefined && { shipping_c: data.shipping }),
            ...(data.shippingAddress && { shipping_address_c: JSON.stringify(data.shippingAddress) }),
            ...(data.status && { status_c: data.status }),
            ...(data.subtotal !== undefined && { subtotal_c: data.subtotal }),
            ...(data.tax !== undefined && { tax_c: data.tax }),
            ...(data.total !== undefined && { total_c: data.total })
          }
        ]
      };

      const response = await apperClient.updateRecord('order_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update order");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Order updated successfully");
          return successful[0].data;
        }
      }

      throw new Error("Failed to update order");
    } catch (error) {
      console.error("Error updating order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('order_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to delete order");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Order deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error);
      throw error;
    }
  }
};