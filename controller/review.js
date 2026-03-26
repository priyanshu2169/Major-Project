const { model } = require("mongoose");
let Listing=require("../Models/model1.js");
let Review=require("../Models/review.js");

module.exports.createReview=async (req,res)=>{
    
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${req.params.id}`);
}



module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //used to delete that review from review array from listings
    await Review.findByIdAndDelete(reviewId); //specifically used to delete that review
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}