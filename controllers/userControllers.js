let ObjectId = require('mongodb').ObjectID
const crypto = require("crypto");
const { encrypt } = require("../utils/crypto");
const axios = require("axios");
// Required Third party pkg
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Required Config
const JWT_SECRET = process.env.JWT_SECRET;
// Required Models
const User = require("../models/user");
const AWS = require('aws-sdk');


module.exports = {
  addUser: async (req, res, next) => {
    let { firstName, lastName, userName, email, password,parents,role } = req.body;

    // Simple validation
    if (!firstName || !lastName || !userName ||  !email || !password || !parents || !role) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
      const {userRole}=req.user;
      if(userRole=="admin"){
        const emailExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

        const usernameRegex = /^[a-z0-9_]+$/.test(userName);

        const passwordExpression = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);

        if (!emailExpression) {
          return res.status(200).json({ msg: "Please enter proper email data" });
        }
        if(!usernameRegex){
          return res.status(200).json({ msg: "Please enter proper username data" });
        }
        if(!passwordExpression){
          return res.status(200).json({ msg: "Please enter proper format data" });
        }

      
        var user = await User.findOne({ email: email });
        if (user) {
          return res.status(200).json({ msg: "Email already exists" });
        }

        user = await User.findOne({ userName: userName});
        if (user) {
          return res.status(200).json({ msg: "Username already exists" });
        }

        

        // *salting a password
        const salt = await bcrypt.genSalt(10);
        let new_pwd = password;
        const hash = await bcrypt.hash(new_pwd, salt);
        
        const newUser = new User({
          userName,
          firstName, 
          lastName,   
          email,
          password: hash,
          parents,
          isActive:true,
          role
        });

        const savedUser = await newUser.save();

        

        return res.status(200).json({
          user: {
            id: savedUser.id,
            userName: savedUser.userName,
            email: savedUser.email,
            firstName:savedUser.firstName,
            lastName:savedUser.lastName,
            parents: savedUser.parents,
            role:savedUser.role
          },
        });
      }else{
        return res.status(200).json({ msg: "You are not authorized" });
      }
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  getAllUser: async(req, res, next) => {
    try {

      let users = await User.find({isActive:true}, {email: 1, userName: 1, firstName: 1, lastName: 1, parents: 1, role: 1, isActive: 1,profile_img:1});
      if(users.length==0){
        res.status(400).json({ msg: "Users Not Found" });
      }
      else{
        res.status(200).json({ users });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getUserById: async(req, res, next) => {
    try {
      let {id}=req.params;
      let user = await User.findOne({_id:id});
      if(!user){
        res.status(400).json({ msg: "User Not Found" });
      }
      else{
        res.status(200).json({ user });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  getUserByparent: async(req, res, next) => {
    try {
      let {id}=req.params;
      let users = await User.find({parents:id});
      if(!users){
        res.status(400).json({ msg: "User Not Found" });
      }
      else{
        res.status(200).json({ users });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateUser: async(req, res, next) => {
    try {
      let {userId}=req.user;
      let { firstName, lastName, userName,slackId,parents,bio } = req.body;
      let user = await User.findOne({_id:userId});
      if(!user){
        res.status(400).json({ msg: "User Not Found" });
      }
         
  

      let users = await User.findOne({ _id:{$ne:id}, userName: userName});
      if (users) {
        return res.status(200).json({ msg: "Username already exists" });
      }

      else{
        let body={
          userName: userName? userName : user.userName,
          firstName: firstName? firstName: user.firstName, 
          lastName: lastName? lastName : user.lastName,  
          parents: parents?.length!=0? parents: user.parents,
          bio: bio? bio : user.bio,
          slackId: slackId? slackId : user.slackId,
          updatedBy: user.email 
        }
        user= await User.findByIdAndUpdate({ _id:id},body);
        user= await User.findById({ _id:id});

        return res.status(200).json({ msg: "User edited successfully" });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },


  updateUserProfileImg: async(req, res, next) => {
    try {
      let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });

      let {userId}=req.user;
      const image = req.file;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `profile/${userId}.png`,
        Body: image.buffer,
        ContentType: image.mimetype
      };

      s3bucket.upload(params, async (err, data) => {
        try {
          if (err) {
            res.status(500).json({ error: true, Message: err });
          } else {
            const newFileUploaded = {
              fileLink: data.Location,
              s3_key: params.Key
            };
            const updateProfile = await User.findOneAndUpdate({ _id:userId},{profile_img:newFileUploaded.fileLink});
            return res.status(200).json({ msg: "User edited successfully" ,profile_img:newFileUploaded.fileLink});
          }
        } catch (err) {
          console.log(err);
          return res.status(500).json({ msg: 'Server Error', error: err });
        }
      });

    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },


  deleteUser: async(req, res, next) => {
    try {
      const { id } = req.params;
      let user = await User.findByIdAndUpdate({_id:id},{isActive:false});
      if(user){
        res.status(200).json({ user });
      }
      else{
        res.status(400).json({ msg: "User Not Found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  checkuserName: async(req, res, next) => {
    try {
      const { userName } = req.query;
      user = await User.findOne({ userName: userName});
      if(user){
        res.status(200).json({ userName: false });
      }
      else{
        res.status(200).json({ userName: true });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  loginUser: async (req, res, next) => {
    let { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user){
        return res.status(200).json({ msg: "User does not exist"})
      }
      let newPwd = password;
      const isMatch = await bcrypt.compare(newPwd, user.password);
      if (!isMatch){
        return res.status(200).json({ msg: "Invalid credentials"})
      }

      
      const token = jwt.sign({ userId: user._id, userName: user.userName, userRole: user.role }, JWT_SECRET, {
        //expiresIn: 3600,
      });
      if (!token) throw Error("Couldnt sign the token");
      
      // Set session
      // var sess = req.session;
      // sess.email = user.email;
      // sess.user_id = user._id;
      // sess.userName = user.userName;

      
      res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          parents: user.parents,
          slackId: user.slackId,
          bio: user.bio,
          role: user.role,
          profile_img:user.profile_img

        },
      });

      

    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  },

  connectSlack: async (req, res, next) => {
    try {
      const { code, state } = req.query;

      const isUser = await User.findById(ObjectId(state));
      if (!isUser) {
        return res.status(400).json({ msg: "User does not exist" });
      }

      const response = await axios.post(
        `https://slack.com/api/oauth.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.ok) {
        const { access_token, user_id } = response.data;
        const encryptedToken = await encrypt(access_token);
        const user = await User.findByIdAndUpdate(state, { slackToken: access_token, slackId: user_id });
        return res.send(`<body
        style="
          margin: 0;
          padding: 0;
          background-color: #f2f2ff;
          font-family: Poppins, sans-serif;
        "
      >
        <div
          style="
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <div>
            <div style="display: flex; justify-content: center">
              <img
                src="https://rejoicehub.com/static/media/rejoice-white-logo.60eca72e.png"
                alt="logo"
                style="width: 125px"
              />
            </div>
            <button
              style="
                font-weight: 600;
                font-size: 20px;
                padding: 10px 15px;
                border-radius: 6px;
                box-shadow: 0 3px 15px 2px #0000001a;
                height: 50px;
                color: #131313;
                min-width: 220px;
                border: 1px solid transparent;
                background-color: #fff;
              "
            >
              Authorized
            </button>
          </div>
        </div>
      </body>
    
      <script>
        window.setInterval(function () {
          window.close();
        }, 2000);
        </script>
`);
      } else {
        return res.status(400).json({ msg: "Error in connecting slack" });
      }
      
    } catch (error) {
        return res.status(400).json({ error: error.message });    
    }
  },

  resetPassword: async (req, res, next) => {
    try{
      const { email } = req.body;
      if (!email) {
        return res.status(200).json({ msg: "Please enter all fields" });
      }

      const user = await User.findOne({ email: email });
        if (!user){
          return res.status(200).json({ msg: "User does not exist" });
        }

      const tokenStr = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = tokenStr;
      user.passwordResetExpires = Date.now() + 3600000;
      user.save();
      
      var tokenlink = `https://portablelib.netlify.app/auth/reset-password?token=${tokenStr}`;
      mailTemp.resetPwd(user.userName, user.email, tokenlink);
      return res
        .status(200)
        .json({ msg: "Reset Link sent on your email address" });
    } catch(error){
      return res.status(400).json({ "err": "Not work proper of reset"});
    }
  },

  newPassword: async (req, res, next) => {
    const token = req.params.token;
    const {newPassword} = req.body;
    
    try{
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
      });

      if(!user){
        return res.status(200).json({"msg": "user token not found"});
      }

      const salt = await bcrypt.genSalt(10);
      let newPwd = user._id.toString() + newPassword;
      const hashedPassword = await bcrypt.hash(newPwd, salt);
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save();
      
      return res.status(200).json({ msg: "Password Change Successfully!! Please Login." });

    } catch(error){
      return res.status(400).json({"Errmsg": error});
    }
  },
};
