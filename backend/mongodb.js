const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURI)
.then(() => {
    console.log("Connected to MongoDB successfully.");
})