import productData from "@/services/mockData/products.json";

export const productService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...productData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = productData.find(item => item.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...productData.map(p => p.Id)) + 1;
    const newProduct = { ...item, Id: newId };
    productData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = productData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    productData[index] = { ...productData[index], ...data };
    return { ...productData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = productData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const deleted = productData.splice(index, 1)[0];
    return { ...deleted };
  }
};