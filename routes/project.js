const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectControllers");
const auth = require("../middleware/auth");

// *route   GET /find-all
// ?desc    Fetch project
// @access  Public
router.get("/find-all", projectController.getProjects);

// *route   GET /find-all
// ?desc    Fetch project
// @access  Private
router.get("/selectuser", auth, projectController.getassignProjects);

// *route    POST /add
// ?desc     Add project
// @access   Admin
router.post("/add", auth, projectController.addProject);

// *route    PUT /edit/:id
// ?desc     Edit project
// @access   Admin
router.put("/edit/:id", auth, projectController.editProject);

// *route    DELETE /remove/:id
// ?desc     Delete project
// @access   Admin
router.delete("/remove/:id", auth, projectController.deleteProject);

// *route    DELETE /remove/:id
// ?desc     Delete project
// @access   Admin
router.post("/assign/:id", auth, projectController.assignproject);


module.exports = router;