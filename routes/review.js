let express=require("express");
let router=express.Router({mergeParams:true});
let wrapAsync=require("../utils/wrapAsync.js");
let {reviewSchema}=require("../Schema.js");
let Review=require("../Models/review.js");
let ExpressError=require("../utils/ExpressError.js");
let Listing=require("../Models/model1.js");
let {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
let reviewController=require("../controller/review.js");




//review post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


//review delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;

