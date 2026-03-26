if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}




//Requirements
let express=require("express");
let mongoose=require("mongoose");
let path=require("path");
let methodOverride=require("method-override");
let ejsMate=require("ejs-mate");
let ExpressError=require("./utils/ExpressError.js");
let session=require("express-session");
const MongoStore = require('connect-mongo').default;
let flash=require("connect-flash");
let passport=require("passport");
let LocalStrategy=require("passport-local");
let User=require("./Models/user.js");


let listingRouter=require("./routes/listing.js");
let reviewRouter=require("./routes/review.js");
let userRouter=require("./routes/user.js");
let searchRouter=require("./routes/search.js");



//connection with server
let app=express();
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});



// middlewares and setters
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const db_url=process.env.Atlasdb_URL;
//connection with database
main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    
    mongoose.connect(db_url);
}

const store=MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

});

store.on("error",()=>{
    console.log("ERROR in Mongo session store",err);
})


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //for saving info. in session
passport.deserializeUser(User.deserializeUser()); //for removing info. from session when session is over

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});


// app.get("/demoUser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"priyanshu@gmail.com",
//         username:"priyanshu-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });






//listings
app.use("/listings",listingRouter);

//reviews
app.use("/listings/:id/reviews",reviewRouter);

//users
app.use("/",userRouter);

//search
app.use("/",searchRouter);







app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});


//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
})
