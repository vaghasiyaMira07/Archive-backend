const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: () => {
        return null;
      },
    },
    description: {
      type: String,
      default: () => {
        return null;
      },
    },
    date: {
      type: Date,
      default: () => {
        return new Date();
      },
    },
    flag: {
      type: String,
      default: () => {
        return null;
      },
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: () => {
          return null;
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model(
  "notification",
  notificationSchema,
  "notification"
);
module.exports = Notification;
