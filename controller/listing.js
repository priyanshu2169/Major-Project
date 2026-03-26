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
        let url=req.file.path;
        let filename=req.file.filename;
        
       
        let NewListing= new Listing(req.body.listing);
        NewListing.owner=req.user._id;
        NewListing.image={url,filename};
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
    let originalImageUrl=listings.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listings,originalImageUrl});
}


module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing=async (req,res)=>{
     let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success","listing deleted");
   res.redirect("/listings");
}