import reviewData from "@/services/mockData/reviews.json";

export const reviewService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...reviewData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const review = reviewData.find(item => item.Id === id);
    if (!review) {
      throw new Error("Review not found");
    }
    return { ...review };
  },

  async getByProductId(productId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const reviews = reviewData.filter(review => review.productId === productId);
    return reviews.map(review => ({ ...review }));
  },

  async create(item) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...reviewData.map(r => r.Id)) + 1;
    const newReview = { ...item, Id: newId };
    reviewData.push(newReview);
    return { ...newReview };
  },

  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = reviewData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    reviewData[index] = { ...reviewData[index], ...data };
    return { ...reviewData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = reviewData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error("Review not found");
    }
    const deleted = reviewData.splice(index, 1)[0];
    return { ...deleted };
  }
};