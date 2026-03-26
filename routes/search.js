let express=require("express");
let router=express.Router();
let wrapAsync=require("../utils/wrapAsync.js");
let Listing=require("../Models/model1.js");
let searchController=require("../controller/search.js");


router.get("/search",searchController.searchListings);


module.exports=router;