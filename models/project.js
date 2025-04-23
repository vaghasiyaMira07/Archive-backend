const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for Database
var projectSchema = new Schema({
    name: {
        type: String,
        default: () => { return null; }
    },
    description: {
        type: String,
        default: () => { return null; }
    },
    isActive: {
        type: Boolean,
        default: () => { return true; }
    },
    assign: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: () => { return null; }
    }],
}, { timestamps: true, versionKey: false })

module.exports = Project = mongoose.model('Project', projectSchema, 'projects');