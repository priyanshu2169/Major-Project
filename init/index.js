let mongoose=require("mongoose");
let initData=require("./data.js");
let Listing=require("../Models/model1.js");

//connection with database
main().then(()=>{
    console.log("Database connected");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust')
}


let initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'69aef99596824f92b280fd8f'}));
    await Listing.insertMany(initData.data);
    console.log("data initialization successfull");
}

initDB();


