const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for Database
var userSchema = new Schema({
    userName: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    firstName: {
        type: String,
        default: () => { return null; }
    },
    lastName: {
        type: String,
        default: () => { return null; }
    },
    bio: {
        type: String,
        default: () => { return null; }
    },
    profile_img: {
        type: String,
        default: () => { return null; }
    },
    isActive: {
        type: Boolean,
        default: () => { return false; }
    },
    slackId: {
        type: String,
        default: () => { return null; }
    },
    slackToken: {
        type: Object,
        default: () => { return null; }
    },
    parents: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    role: {
        type: String,
        default: () => { return "emp"; }
    },
    createdBy: {
        type: String,
        default: () => { return null; }
    },
    updatedBy: {
        type: String,
        default: () => { return null; }
    },
    meta: {
        type: Object,
        default: () => { return {}; }
    }
},{ timestamps: true , versionKey: false })

module.exports = User = mongoose.model('User',userSchema,'users');