let Listing=require("../Models/model1.js");


module.exports.searchListings=async (req,res)=>{
    let {q}=req.query;
    
    // Convert q to string and escape special regex characters
    let searchQuery = String(q || "").trim();
    
    if(!searchQuery) {
        return res.render("listings/search.ejs",{searchItems: []});
    }
    
    let searchItems = await Listing.find({
    $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { country: { $regex: searchQuery, $options: "i" } }
    ]
});
    
    res.render("listings/search.ejs",{searchItems});
}