const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for Database
var reportSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    plan: [{
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
        estimatedHours: {
            type: Number,
            default: () => { return 0; }
        },
        taskType: {
            type: String,
            default: () => { return ""; }
        },
        taskDetails: {
            type: String,
            default: () => { return ""; }
        },
        taskStatus: {
            type: String,
            default: () => { return ""; }
        },
    }],
    status: [{
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project"
        },
        totalHours: {
            type: Number,
            default: () => { return 0; }
        },
        taskType: {
            type: String,
            default: () => { return ""; }
        },
        taskDetails: {
            type: String,
            default: () => { return ""; }
        },
        taskStatus: {
            type: String,
            default: () => { return ""; }
        },
    }],
    isPlanToSlack: {
        type: Boolean,
        default: () => { return false; }
    },
    isStatusToSlack: {
        type: Boolean,
        default: () => { return false; }
    },
    calculatedPoint: {
        type: Number,
        default: () => { return 0; }
    },
    performancePoint: {
        type: Number,
        default: () => { return 0; }
    },
},{ timestamps: true ,versionKey: false })

module.exports = Report = mongoose.model('Report',reportSchema,'reports');