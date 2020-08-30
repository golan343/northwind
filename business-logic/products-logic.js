const Category = require("../models/category");
const Product = require("../models/product");

// Get all products: 
function getAllProductsAsync() {
    return Product.find().exec();
}

// Get one product:
function getOneProductAsync(_id) {
    return Product.findOne({ _id }).exec(); // No need to use ObjectId in Mongoose.
}

// Add product:
function addProductAsync(product) {
    return product.save();
}

// Update product:
async function updateProductAsync(product) {
    const info = await Product.updateOne({ _id: product._id }, product).exec();
    return info.n ? product : null; // info.n === 0 means no product found to update. info.nModified === 0 means no product found to update or product found but not update cause there is no change to update.
}

// Delete product:
function deleteProductAsync(_id) {
    return Product.deleteOne({ _id }).exec();
}

// ---------- Special Queries: ----------

// Get products by price:
function getProductsByPriceAsync(price) {
    return Product.find({ price }).exec();
}

// Get products by name AND price:
function getProductsByNameAndPriceAsync(name, price) {
    return Product.find({ name, price }).exec();
}

// Get products by name OR price:
function getProductsByNameOrPriceAsync(name, price) {
    return Product.find({ $or: [{ name }, { price }] }).exec();
}

// Get products by price range (Comparison Query Operators: $gt, $gte, $lt, $lte, $eq, $ne, $in, $nin):
function getProductsByPriceRangeAsync(minPrice, maxPrice) {
    return Product.find({ price: { $gte: minPrice, $lte: maxPrice } }).exec();
}

// Get sorted products (price desc, name asc):
function getSortedProductsAsync() {
    return Product.find({}, null, { sort: { price: -1, name: 1 } }).exec(); // null returns all props. ["name", "price"] returns only name and price, etc.
}

// Get paged products:
function getPagedProductsAsync(skip, limit) {
    return Product.find({}, null, { skip, limit }).exec();
}

// Get products containing multiple words (using RegEx):
function getMultipleWordsProductsAsync() {
    return Product.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// Get all products, each including its category (join):
function getProductsIncludingCategoryAsync() {
    return Product.find().populate("category").exec(); // Returns a Promise.
}

// Get all categories, each including its products (join):
function getCategoriesIncludingProductsAsync() {
    return Category.find().populate("products").exec();
}

module.exports = {
    getAllProductsAsync,
    getOneProductAsync,
    addProductAsync,
    updateProductAsync,
    deleteProductAsync,
    getProductsByPriceAsync,
    getProductsByNameAndPriceAsync,
    getProductsByNameOrPriceAsync,
    getProductsByPriceRangeAsync,
    getSortedProductsAsync,
    getPagedProductsAsync,
    getMultipleWordsProductsAsync,
    getProductsIncludingCategoryAsync,
    getCategoriesIncludingProductsAsync
};