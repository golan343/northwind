const mongoose = require("mongoose");

function connectAsync() {
    return new Promise((resolve, reject) => {
        const connStr = config.mongodb.connectionString; 
        const options = { useNewUrlParser: true, useUnifiedTopology: true }; // useNewUrlParser: use the new url parser (old one is deprecated), useUnifiedTopology: use the new topology engine for handling the different parts of MongoDB (topology = the way in which the inner parts are interrelated or arranged).
        mongoose.connect(connStr, options, (err, db) => {
            if (err) {
                global.config.err = err;
                reject(err);
                return;
            }
            resolve(db);
        });
    });
}

// Connect to the database:
(async () => {
    try {
        const db = await connectAsync(); // No need to globally save the db object.
        const dbName = db.connections[0].name;
        console.log(`We're connected to ${dbName} database on MongoDB`);
    }
    catch (err) {
        console.error(err);
    }
})();