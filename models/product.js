const mongoose = require("mongoose");

// Create Product Schema: 
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "is missing"],
        minlength: [3, "must be minimum 3 chars"],
        validate: {
            validator: value => /^[A-Z].*$/.test(value),
            message: "must start with a capital letter"
        }
    },
    price: {
        type: Number,
        required: [true, "is missing"],
        min: [0, "can't be negative"],
        max: [10000, "can't exceed 10,000"]
    },
    stock: {
        type: Number,
        required: [true, "is missing"],
        min: [0, "can't be negative"],
        max: [1000, "can't exceed 1000"]
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

// Create a virtual field for the category (only if we do want to get a category with any product):
ProductSchema.virtual("category", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id",
    justOne: true // Create the category as a single object rather than an array.
});

// Create Product Model: 
const Product = mongoose.model("Product", ProductSchema, "products");

module.exports = Product;

// Joi validation advantages:
// We can easily perform separate validations according request method.
// We can return one or all validation errors as we wish (Mongoose returns all).
// We can return an array of validation errors (Mongoose returns one string).

// Mongoose validation advantages: 
// We don't need external library for validation.
// We can easily send back custom error messages.