let express=require("express");
let router=express.Router();
let wrapAsync=require("../utils/wrapAsync.js");
let listingController=require("../controller/listing.js");
let multer=require("multer");
let {storage}=require("../cloudConfig.js");
let upload=multer({storage});

let Listing=require("../Models/model1.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");





router.route("/")
        .get(wrapAsync(listingController.index))
        .post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));
       





//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));


router.route("/:id")
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));






//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));







module.exports=router;