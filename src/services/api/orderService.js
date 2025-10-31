import orderData from "@/services/mockData/orders.json";

export const orderService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...orderData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const order = orderData.find(item => item.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newId = Math.max(...orderData.map(o => o.Id)) + 1;
    const newOrder = { ...item, Id: newId };
    orderData.push(newOrder);
    return { ...newOrder };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = orderData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    orderData[index] = { ...orderData[index], ...data };
    return { ...orderData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = orderData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    const deleted = orderData.splice(index, 1)[0];
    return { ...deleted };
  }
};