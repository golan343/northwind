// Note: process.env.NODE_ENV doesn't exist in Azure.
process.env.PORT ? global.config = require("./config-prod.json") : global.config = require("./config-dev.json");
// global.config = require("./config-dev");
// global.config = require("./config-prod");
require("./data-access-layer/dal");
const express = require("express");
const cors = require("cors");
const path = require("path");
const productsController = require("./controllers/products-controller");

const server = express();
server.use(cors());
server.use(express.json());

// Serve index.html:
server.use(express.static(path.join(__dirname, "./_front-end")));

server.use("/api/products", productsController);

// Any other route - return index.html as we are SPA:
server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./_front-end/index.html"));
});

// Start the server:
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));