const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/BackendForMainProject")
.then(()=>{
    console.log("mongogb connected");
})
.catch(()=>{
    console.log("Failed to connect");
})

const LogInSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    password:{
        type:String,
        required:true
    }
})

const collection = new mongoose.model("logincollection",LogInSchema)
module.exports = collection