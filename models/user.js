const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: String
});

module.exports = new mongoose.model("User", userSchema);