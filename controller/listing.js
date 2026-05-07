let Listing=require("../Models/model1.js");

module.exports.index=async (req,res)=>{
    let alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
}

module.exports.renderNewForm=async (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if(!listings){
      req.flash("error","this listing does not exist");  
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listings});
    
}


module.exports.createListing=async (req,res)=>{
    
       
       
        
        let NewListing= new Listing(req.body.listing);
        NewListing.owner=req.user._id;
        await NewListing.save();
        req.flash("success","New listing created");
        res.redirect("/listings");
    
}


module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    if(!listings){
      req.flash("error","this listing does not exist");  
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listings});
}


module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing=async (req,res)=>{
     let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","listing deleted");
   res.redirect("/listings");
}