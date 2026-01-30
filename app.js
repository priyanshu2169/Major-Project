//Requirements

let express=require("express");
let mongoose=require("mongoose");
let Listing=require("./Models/model1.js");
let path=require("path");
let methodOverride=require("method-override");
let ejsMate=require("ejs-mate");



//connection with server
let app=express();
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});



// middlewares and setters
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));





//connection with database
main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust')
}



// index route/home page
app.get("/listings",async (req,res)=>{
    let alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
});


//new route
app.get("/listings/new",async (req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    res.render("listings/show.ejs",{listings});
    
})


//create route
app.post("/listings",async (req,res)=>{
    let NewListing= new Listing(req.body.listing);
    await NewListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    res.render("listings/edit.ejs",{listings});
});

//update route
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete("/listings/:id",async (req,res)=>{
     let {id}=req.params;
   await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
})



//sample
// app.get("/testSample",async (req,res)=>{
//     Listing.deleteMany();
//     let sampleListing=new Listing({
//     title:"vila",
//     description:"it is beautifula vilala",
//     price:2000,
//     location:"Meerut",
//     country:"India",
// });
// await sampleListing.save();
// console.log("sample saved succesfully");
// res.send("successful testing");
// });


//root page
app.get("/",(req,res)=>{
    res.send("root page");
})
