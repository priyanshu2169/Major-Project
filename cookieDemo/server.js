let express=require("express");
let cookieParsor=require("cookie-parser");
let app=express();
// app.use(cookieParsor("secretcode"));
let session=require("express-session");
let flash=require('connect-flash');
let path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

let sessionOptions={secret:"mysupersecretstring",resave:false,saveUninitialized:true};

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","User not registered");
    }else{
        req.flash("success",`${req.session.name} registered successfully`);
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    
    res.render("page.ejs",{name: req.session.name});
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
    req.session.count=1;
    }
    res.send(`you send req ${req.session.count} times`);
})
app.get("/test",(req,res)=>{
    res.send("test successful");
})




// app.get("/",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hii,${name}`);
    
// })


// app.get("/getCookies",(req,res)=>{
//     res.cookie("name","Priyanshu",{signed:true});
//     res.cookie("madeIn","India");
//     res.send("cookie sent");
    
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })


app.listen(3000,()=>{
    console.log("server is listening on port 3000");
});