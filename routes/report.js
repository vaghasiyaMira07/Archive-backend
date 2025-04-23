const express = require("express");
const router = express.Router();
const projectController = require("../controllers/reportControllers");
const auth = require("../middleware/auth");

// *route   GET /find-all
// ?desc    Fetch report
// @access  Admin
router.get("/find-all", auth, projectController.getReport);

// *route    POST /add
// ?desc     Add report
// @access   User
router.post("/add", auth, projectController.addReport);



router.post("/selectedreport", auth, projectController.selectedreport);


// *route    PUT /edit/:id
// ?desc     Edit report
// @access   User
router.put("/edit/:reportid/:type/:id", auth, projectController.editReport);

// *route    DELETE /delete/:type/:id
// ?desc     Delete report
// @access   User
router.delete("/delete/:reportid/:type/:id", auth, projectController.deleteReportOrTask);

// *route    GET /send-report-slack
// ?desc     Send report
// @access   Private
router.get("/send-report-slack", auth, projectController.sendReportSlackChannel);

module.exports = router;