const express = require("express");
const Product = require("../models/product");
const productsLogic = require("../business-logic/products-logic");

// Create the router:
const router = express.Router();

// Get all products: 
router.get("/", async (request, response) => {
    try {
        const products = await productsLogic.getAllProductsAsync();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get one product: 
router.get("/:_id", async (request, response) => {
    try {
        const product = await productsLogic.getOneProductAsync(request.params._id);
        if (!product) {
            response.sendStatus(404);
            return;
        }
        response.json(product);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Add product: 
router.post("/", async (request, response) => {
    try {
        const product = new Product(request.body);

        // Validate product:
        const error = await product.validate();
        if (error) {
            response.status(400).send(error.message);
            return;
        }

        const addedProduct = await productsLogic.addProductAsync(product);
        response.status(201).json(addedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Update full product: 
router.put("/:_id", async (request, response) => {
    try {
        const product = new Product(request.body);
        product._id = request.params._id;

        // Validate product:
        const error = await product.validate();
        if (error) {
            response.status(400).send(error.message);
            return;
        }

        const updatedProduct = await productsLogic.updateProductAsync(product);
        if (!updatedProduct) {
            response.sendStatus(404);
            return;
        }

        response.json(updatedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Update partial product: 
router.patch("/:_id", async (request, response) => {
    try {
        const product = new Product(request.body);
        product._id = request.params._id;

        // Can't elegantly validate using Mongoose validation, cause the require validation will fail the patch.

        const updatedProduct = await productsLogic.updateProductAsync(product);
        if (!updatedProduct) {
            response.sendStatus(404);
            return;
        }
        
        response.json(updatedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Delete product: 
router.delete("/:_id", async (request, response) => {
    try {
        await productsLogic.deleteProductAsync(request.params._id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// ---------- Special Queries: ----------

// Get products by price:
router.get("/by-price/:price", async (request, response) => {
    try {
        const price = +request.params.price;
        const products = await productsLogic.getProductsByPriceAsync(price);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get products by name AND price:
router.get("/by-name-and-price/:name/:price", async (request, response) => {
    try {
        const name = request.params.name;
        const price = +request.params.price;
        const products = await productsLogic.getProductsByNameAndPriceAsync(name, price);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get products by name OR price:
router.get("/by-name-or-price/:name/:price", async (request, response) => {
    try {
        const name = request.params.name;
        const price = +request.params.price;
        const products = await productsLogic.getProductsByNameOrPriceAsync(name, price);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get products by price range:
router.get("/by-price-range/:minPrice/:maxPrice", async (request, response) => {
    try {
        const minPrice = +request.params.minPrice;
        const maxPrice = +request.params.maxPrice;
        const products = await productsLogic.getProductsByPriceRangeAsync(minPrice, maxPrice);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get sorted products (price desc, name asc)
// (Two phrases are needed in the route, cause only one will be caught in the "/:_id" route):
router.get("/sorted/price-desc-name-asc", async (request, response) => {
    try {
        const products = await productsLogic.getSortedProductsAsync();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get paged products:
router.get("/paged/:skip/:limit", async (request, response) => {
    try {
        const skip = +request.params.skip;
        const limit = +request.params.limit;
        const products = await productsLogic.getPagedProductsAsync(skip, limit);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get products containing multiple words (using RegEx):
router.get("/search/multiple-words", async (request, response) => {
    try {
        const products = await productsLogic.getMultipleWordsProductsAsync();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get all products, each including its category (join):
router.get("/join/products-including-category", async (request, response) => {
    try {
        const products = await productsLogic.getProductsIncludingCategoryAsync();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// Get all categories, each including its products (join):
router.get("/join/categories-including-products", async (request, response) => {
    try {
        const categories = await productsLogic.getCategoriesIncludingProductsAsync();
        response.json(categories);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;