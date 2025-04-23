const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const auth=require("../middleware/auth")
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// *route   GET /find-all
// ?desc    Get all users
// @access  Admin
router.get("/find-all",auth, userController.getAllUser);

// *route   GET /find-by-id/:id
// ?desc    Get user by id
// @access  Admin and Parent
router.get("/find-by-id/:id",auth, userController.getUserById);

// *route   POST /find-by-parent/:id
// ?desc    Get user by parent id
// @access  Admin and Parent
router.get("/find-by-parent/:id",auth, userController.getUserByparent);

// *route    POST /signup
// ?desc     User Register api
// @access   Admin
router.post("/signup", auth, userController.addUser);

// *route    POST /login
// ?desc     User login
// @access   Public
router.post("/login", userController.loginUser);

// *route    PUT /edit/:id
// ?desc     Edit user
// @access   Private
router.put("/edit/:id",auth, userController.updateUser);

// *route    PUT /profile/img
// ?desc     Edit user profile image
// @access   Private
router.put("/profile/img",auth, upload.single('file'),userController.updateUserProfileImg);

// *route    DELETE /remove/:id
// ?desc     Remove user
// @access   Private and Admin
router.delete("/remove/:id",auth, userController.deleteUser);

// *route    GET /connect-slack/:id
// ?desc     Connect slack
// @access   Private
router.get("/connect-slack", userController.connectSlack);


module.exports = router;