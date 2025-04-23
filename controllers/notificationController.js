const notificationSchema = require("../models/notification");

module.exports = {
  // Create a new notification in the database
  addNotification: async (req, res, next) => {
    const { title, description, userId, date } = req.body;
    if (!title || !description || !userId || !date) {
      return res.status(404).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    if (userId instanceof Array === false) {
      return res.status(406).json({
        success: false,
        error: "userId must be an array",
      });
    }

    //for loop for userId
    let userIdArray = [];
    for (let i = 0; i < userId.length; i++) {
      userIdArray.push(userId[i]);
    }

    const dateFromUser = new Date(date);

    //object for notification model
    let notification = {
      title: title,
      description: description,
      userId: userIdArray,
      date: dateFromUser,
      flag: "pending",
    };

    try {
      const { userRole } = req.user;
      if (userRole == "admin") {
        const storedNotification = await notificationSchema.create(
          notification
        );
        return res.status(200).json({
          success: true,
          data: storedNotification,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Only admin can add notification",
        });
      }
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  },

  // Get notifications by userId
  getNotification: async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) {
      return res.status(404).json({
        success: false,
        error: "Please provide userId",
      });
    }

    try {
      const notification = await notificationSchema.find({
        userId: userId,
      });
      const notificationCount = await notificationSchema
        .find({
          userId: userId,
        })
        .count();
      return res.status(200).json({
        success: true,
        data: notification,
        count: notificationCount,
      });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  },

  // Get all notifications from the database
  getAllNotification: async (req, res, next) => {
    try {
      const { userRole } = req.user;
      if (userRole == "admin") {
        const { id } = req.user;
        let criteria = {};
        if (id) {
          criteria = { _id: id };
        }

        const notification = await notificationSchema.find(criteria);
        const notificationCount = await notificationSchema.count(criteria);
        return res.status(200).json({
          success: true,
          data: notification,
          count: notificationCount,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Only admin can get notification",
        });
      }
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  },

  // Update notification status by id
  updateNotificationStatus: async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({
        success: false,
        error: "Please provide id",
      });
    }
    const existNotification = await notificationSchema.findOne({ _id: id });
    if (!existNotification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    try {
      //set notification status object to update
      let object4flag = {};
      if (existNotification.flag == "pending") {
        object4flag = {
          $set: { flag: "completed" },
        };
      } else if (existNotification.flag == "completed") {
        object4flag = {
          $set: { flag: "pending" },
        };
      }

      const updatedNotification = await notificationSchema.findOneAndUpdate(
        { _id: id },
        object4flag,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: updatedNotification,
      });
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  },

  //update notification status by id
  updateNotification: async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({
        success: false,
        error: "Please provide id",
      });
    }
    const { title, description, date } = req.body;
    if (!title || !description || !date) {
      return res.status(404).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    const dateFromUser = new Date(date);
    //object for notification model
    let notification = {
      $set: {
        title: title,
        description: description,
        date: dateFromUser,
      },
    };

    try {
      const { userRole } = req.user;
      if (userRole == "admin") {
        const storedNotification = await notificationSchema.findOneAndUpdate(
          { _id: id },
          notification,
          { new: true }
        );
        return res.status(200).json({
          success: true,
          data: storedNotification,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Only admin can update notification",
        });
      }
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  },

  // Delete notification by id
  deleteNotification: async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({
        success: false,
        error: "Please provide id",
      });
    }
    try {
      const { userRole } = req.user;
      if (userRole == "admin") {
        await notificationSchema.findOneAndDelete({ _id: id });
        return res.status(200).json({
          success: true,
          message: "Notification deleted successfully",
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Only admin can delete notification",
        });
      }
    } catch (e) {
      return res.status(400).json({ success: false, error: e.message });
    }
  },
};
