const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// @route   POST add-notification
// @desc    Add notification
// @access  admin
router.post("/add-notification", auth, notificationController.addNotification);

// @route   GET get-notification
// @desc    Get notification by userId
// @access  admin
router.get("/get-notification", auth, notificationController.getNotification);

// @route   GET get-all-notification
// @desc    Get all notification
// @access  admin
router.get(
  "/get-all-notification",
  auth,
  notificationController.getAllNotification
);

// @route   PUT update-notification
// @desc    update notification
// @access  admin
router.put(
  "/update-notification-status",
  auth,
  notificationController.updateNotificationStatus
);

// @route   PUT remove-notification
// @desc    update notification
// @access  admin
router.put(
  "/update-notification",
  auth,
  notificationController.updateNotification
);

// @route   DELETE remove-all-notification
// @desc  delete notification
// @access  admin
router.delete(
  "/delete-notification",
  auth,
  notificationController.deleteNotification
);

module.exports = router;
