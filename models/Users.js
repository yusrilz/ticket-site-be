const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please insert a name"],
    },
    email: {
        type: String,
        required: [true, "Please insert an email"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please insert a password"],
        minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {timestamps: true} )
module.exports = mongoose.model("User", userSchema);