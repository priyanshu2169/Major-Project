let express=require("express");
let router=express.Router();
let User=require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync");
let passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
let userController=require("../controller/user.js");


router.route("/signup")
        .get(userController.renderSignupForm)
        .post(wrapAsync(userController.signUp));



router.route("/login")
        .get(userController.renderLoginForm)
        .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),wrapAsync(userController.login));





router.get("/logout",userController.logOut)

module.exports=router;